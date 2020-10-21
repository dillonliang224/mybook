hystrix-go是集流量控制、熔断、容错等于一身的库

hystrix使用非常简单，参考官方API可以一探究竟。

1。 采用令牌桶的策略来限流

2。 利用动态窗口的特性计算QPS，错误率等

3。 根据2来开始或关闭断路器

4。 有fallback支持

## 异步方法

```go
// Go runs your function while tracking the health of previous calls to it.
// If your function begins slowing down or failing repeatedly, we will block
// new calls to it for you to give the dependent service time to repair.
//
// Define a fallback function if you want to define some code to execute during outages.
func Go(name string, run runFunc, fallback fallbackFunc) chan error {
    runC := func(ctx context.Context) error {
        return run()
    }
    var fallbackC fallbackFuncC
    if fallback != nil {
        fallbackC = func(ctx context.Context, err error) error {
            return fallback(err)
        }
    }
    return GoC(context.Background(), name, runC, fallbackC)
}
```

它和同步方法的不同是返回一个chan error

## 同步方法

```go
// Do runs your function in a synchronous manner, blocking until either your function succeeds
// or an error is returned, including hystrix circuit errors
// Do方法是同步阻塞的，直到返回成功或者报错（包括hystrix错误）
func Do(name string, run runFunc, fallback fallbackFunc) error {
    runC := func(ctx context.Context) error {
        return run()
    }
    var fallbackC fallbackFuncC
    if fallback != nil {
        fallbackC = func(ctx context.Context, err error) error {
            return fallback(err)
        }
    }
    return DoC(context.Background(), name, runC, fallbackC)
}
```

包装了runFun和fallbackFun，然后调用Doc方法

```go
// DoC runs your function in a synchronous manner, blocking until either your function succeeds
// or an error is returned, including hystrix circuit errors
func DoC(ctx context.Context, name string, run runFuncC, fallback fallbackFuncC) error {
    // 完成通知chan
    done := make(chan struct{}, 1)

    r := func(ctx context.Context) error {
        err := run(ctx)
        if err != nil {
            return err
        }

        done <- struct{}{}
        return nil
    }

    f := func(ctx context.Context, e error) error {
        // 降级的时候调用fallback
        err := fallback(ctx, e)
        if err != nil {
            return err
        }

        done <- struct{}{}
        return nil
    }

    var errChan chan error
    if fallback == nil {
        // 最终调用GoC方法
        errChan = GoC(ctx, name, r, nil)
    } else {
        errChan = GoC(ctx, name, r, f)
    }

    select {
    case <-done:
        return nil
    case err := <-errChan:
        return err
    }
}
```

### GoC方法

不管是同步方法还是异步方法，最终都会调用到此。

```go
// GoC runs your function while tracking the health of previous calls to it.
// If your function begins slowing down or failing repeatedly, we will block
// new calls to it for you to give the dependent service time to repair.
// GoC执行定义的run方法，如果发生处理缓慢或者失败率上升，它会阻塞新的请求，这样可以使依赖
// 的服务有时间恢复过来。
//
// Define a fallback function if you want to define some code to execute during outages.
// 定义一个fallback函数，用来在中断的情况下执行
func GoC(ctx context.Context, name string, run runFuncC, fallback fallbackFuncC) chan error {
    cmd := &command{
        run:      run,
        fallback: fallback,
        start:    time.Now(),
        errChan:  make(chan error, 1),
        finished: make(chan bool, 1),
    }

    // dont have methods with explicit params and returns
    // let data come in and out naturally, like with any closure
    // explicit error return to give place for us to kill switch the operation (fallback)

    // 根据资源名获取断路器，每个资源一个断路器
    circuit, _, err := GetCircuit(name)
    if err != nil {
        cmd.errChan <- err
        return cmd.errChan
    }
    cmd.circuit = circuit
    ticketCond := sync.NewCond(cmd)
    ticketChecked := false 
    // When the caller extracts error from returned errChan, it's assumed that
    // the ticket's been returned to executorPool. Therefore, returnTicket() can
    // not run after cmd.errorWithFallback().
    returnTicket := func() {
        cmd.Lock()
        // Avoid releasing before a ticket is acquired.
        for !ticketChecked {
            ticketCond.Wait()
        }
        cmd.circuit.executorPool.Return(cmd.ticket)
        cmd.Unlock()
    }
    // Shared by the following two goroutines. It ensures only the faster
    // goroutine runs errWithFallback() and reportAllEvent().
    returnOnce := &sync.Once{}
    reportAllEvent := func() {
        err := cmd.circuit.ReportEvent(cmd.events, cmd.start, cmd.runDuration)
        if err != nil {
            log.Printf(err.Error())
        }
    }

    go func() {
        defer func() { cmd.finished <- true }()

        // Circuits get opened when recent executions have shown to have a high error rate.
        // Rejecting new executions allows backends to recover, and the circuit will allow
        // new traffic when it feels a healthly state has returned.
        if !cmd.circuit.AllowRequest() {
            cmd.Lock()
            // It's safe for another goroutine to go ahead releasing a nil ticket.
            ticketChecked = true
            ticketCond.Signal()
            cmd.Unlock()
            returnOnce.Do(func() {
                returnTicket()
                cmd.errorWithFallback(ctx, ErrCircuitOpen)
                reportAllEvent()
            })
            return
        }

        // As backends falter, requests take longer but don't always fail.
        //
        // When requests slow down but the incoming rate of requests stays the same, you have to
        // run more at a time to keep up. By controlling concurrency during these situations, you can
        // shed load which accumulates due to the increasing ratio of active commands to incoming requests.
        cmd.Lock()
        select {
        case cmd.ticket = <-circuit.executorPool.Tickets:
            ticketChecked = true
            ticketCond.Signal()
            cmd.Unlock()
        default:
            ticketChecked = true
            ticketCond.Signal()
            cmd.Unlock()
            returnOnce.Do(func() {
                returnTicket()
                cmd.errorWithFallback(ctx, ErrMaxConcurrency)
                reportAllEvent()
            })
            return
        }

        runStart := time.Now()
        runErr := run(ctx)
        returnOnce.Do(func() {
            defer reportAllEvent()
            cmd.runDuration = time.Since(runStart)
            returnTicket()
            if runErr != nil {
                cmd.errorWithFallback(ctx, runErr)
                return
            }
            cmd.reportEvent("success")
        })
    }()

    go func() {
        timer := time.NewTimer(getSettings(name).Timeout)
        defer timer.Stop()

        select {
        case <-cmd.finished:
            // returnOnce has been executed in another goroutine
        case <-ctx.Done():
            returnOnce.Do(func() {
                returnTicket()
                cmd.errorWithFallback(ctx, ctx.Err())
                reportAllEvent()
            })
            return
        case <-timer.C:
            returnOnce.Do(func() {
                returnTicket()
                cmd.errorWithFallback(ctx, ErrTimeout)
                reportAllEvent()
            })
            return
        }
    }()

    return cmd.errChan
}
```

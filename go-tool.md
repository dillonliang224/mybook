# Go工具库

## go pprof性能分析

- CPU profile： 报告程序的CPU使用情况，按照一定频率去采集应用程序在CPU和寄存器上面的数据

- Memory Profile: 报告程序的内存使用情况

- Block Profile: 报告goroutines不在运行状态的情况，可以用来分析和查找死锁等性能瓶颈，记录goroutine阻塞等待同步（包括定时器通道）的位置

- Goroutine Profile: 报告goroutines的使用情况，有哪些goroutine，它们的调用关系是怎样的

- Mutex Profiling: 互斥锁分析，报告互斥锁的竞争情况



### 交互式终端下，各字段含义：

| 字段    | 含义                 |
| ----- | ------------------ |
| flat  | 函数自身的运行耗时          |
| flat% | 函数自身在CPU运行耗时总比例    |
| sum%  | 函数自身累积使用CPU总比例     |
| cum   | 函数自身及其调用函数的运行总耗时   |
| cum%  | 函数自身及其调用函数的运行耗时总比例 |
| name  | 函数名                |



### CPU Profiling

```bash
go tool pprof http://localhost:8080/debug/pprof/profile\?seconds\=60
```



### Heap Profiling

```bash
## 常驻内存占用情况
go tool pprof -inuse_space  http://localhost:8080/debug/pprof/heap


## 内存临时分配情况
go tool pprof -alloc_objects http://localhost:8080/debug/pprof/heap


## 常驻内存对象情况
go tool pprof -inuse_objects http://localhost:8080/debug/pprof/heap


## 内存分配空间大小
go tool pprof -alloc_space http://localhost:8080/debug/pprof/heap
```



### Goroutine Profiling

```bash
go tool pprof http://localhost:8080/debug/pprof/goroutine
```



在查看goroutine时，可以使用**traces**命令，这个命令会打印出对应的所有调用栈，以及指标信息。



### 查看trace

```bash
curl http://localhost:8080/debug/pprof/trace\?seconds\=20 > trace.out
go tool trace trace.out
```



会在本地启一个浏览器，查看跟踪，主要字段含义：

| field                            | desc         |
| -------------------------------- | ------------ |
| View Trace                       | 查看跟踪         |
| Goroutine analysis               | 网络阻塞概况       |
| Synchronization blocking profile | 同步阻塞情况       |
| Syscall blocking profile         | 系统调用阻塞情况     |
| Scheduler latency profile        | 调度延迟概况       |
| User defined tasks               | 用户自定义任务      |
| User defined regions             | 用户自定义区域      |
| Minimum mutator utilization      | 最低Mutator利用率 |





### 可视化界面

更多情况下，使用可视化界面更容易发现问题

```bash
## 1. 获待分析的profile文件
wget http://localhost:8080/debug/pprof/profile
## 2.1 在浏览器里查看
go tool pprof -http=:6001 profile

## 2.2 通过web命令将以svg的文件格式写入文件，然后在web浏览器中将其打开
## 需要注意的是，本地需要安装graphviz组件
```



### 通过测试用例做分析

```bash
go test -bench=. -cpuprofile=cpu.profile
```



执行完bench后，会在当前命令生成cpu.profile文件



### 检查内存是否泄露

时间点1堆的profile

```bash
curl -s http://127.0.0.1:8080/debug/pprof/heap > base.heap
```

时间点2堆的profile

```bash
curl -s http://127.0.0.1:8080/debug/pprof/heap > current.heap
```

比较两个时间点的堆的差异

```bash
go tool pprof --base base.heap current.heap
```

或直接打开web界面

```bash
go tool pprof --http :9090 --base base.heap current.heap
```



## string和bytes转换

### string to bytes

```go
func String2Bytes(s string) []byte {
    x := (*[2]uintptr)(unsafe.Pointer(&s))
    h := [3]uintptr{x[0], x[1], x[1]}
    return *(*[]byte)(unsafe.Pointer(&h))
}
```

### bytes to string

```go
func Bytes2String(b []byte) string {
    return *(*string)(unsafe.Pointer(&b))
}
```





---

TODO:

字节框架： https://mp.weixin.qq.com/s/43yN06UUcia-yWdJ50ghrw

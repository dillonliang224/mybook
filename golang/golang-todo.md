# Golang TODO

- 逃逸分析

- Golang Debug

- 垃圾回收

- 字节对齐

## 测试

> 人是否会进步以及进步得有多快，依赖的恰恰就是对自我的否定，这包括否定的深刻与否，以及否定自我的频率如何。这其实就是“不破不立”这个词表达的含义。 

### 规定

go语言对测试函数的名称和签名都有哪些规定？

- 对于功能测试函数来说，其名称必须以Test为前缀，并且参数列表中只应有一个*testing.T类型的参数声明。

- 对于性能测试函数来说，其名称必须以Benchmark为前缀，并且唯一参数的类型必须是*testing.B类型的。

- 对于示例测试函数来说，其名称必须以Example为前缀，但对函数的参数列表没有强制规定。

### 流程

go test命令在开始运行时，会先做一些准备工作，比如，确定内部需要用到的命令，检查我们指定的代码包或源码文件的有效性，以及判断我们给予的标记是否合法，等等。

在准备工作顺利完成之后，go test命令就会针对每个被测代码包，依次地进行构建、执行包中符合要求的测试函数，清理临时文件，打印测试结果。这就是通常情况下的主要测试流程。请注意上述的“依次”二字。对于每个被测代码包，go test命令会串行地执行测试流程中的每个步骤。

但是，为了加快测试速度，它通常会并发地对多个被测代码包进行功能测试，只不过，在最后打印测试结果的时候，它会依照我们给定的顺序逐个进行，这会让我们感觉到它是在完全串行地执行测试流程。

另一方面，由于并发的测试会让性能测试的结果存在偏差，所以性能测试一般都是串行进行的。更具体地说，只有在所有构建步骤都做完之后，go test命令才会真正地开始进行性能测试。

并且，下一个代码包性能测试的进行，总会等到上一个代码包性能测试的结果打印完成才会开始，而且性能测试函数的执行也都会是串行的。

### 框架

- testify

## strings

### 与string值相比，strings.Builder类型的值有哪些优势？

- 已存在的内容不可变，但可以拼接更多的内容(Write/WriteByte/WriteRune/WriteString)

- 减少了内存分配和内容拷贝的次数(copyCheck/Grow)

- 可将内容重置，可重用值。(Reset)

string类型的值是不可变的，对字符串的裁剪、拼接都会产生一个新的字符串。

你可以把这块内存的内容看成一个字节数组，而相应的string值则包含了指向字节数组头部的指针值。如此一来，我们在一个string值上应用切片表达式，就相当于在对其底层的字节数组做切片。

在进行字符串拼接的时候，Go语言会把所有被拼接的字符串依次拷贝到一个崭新且足够大的连续内存空间中，并把持有相应指针值的string值作为结果返回。

显然，当程序中存在过多的字符串拼接操作的时候，会对内存的分配产生非常大的压力。

###

### strings.Builder类型在使用上有约束吗？

- 在已被真正使用后就不可再被复制

- 由于其内容不是完全不可变的，所有需要使用方自行解决操作冲突和并发安全问题。

正是由于已使用的Builder值不能再被复制，所以肯定不会出现多个Builder值中的内容容器（也就是那个字节切片）共用一个底层字节数组的情况。这样也就避免了多个同源的Builder值在拼接内容时可能产生的冲突问题。

虽然已使用的Builder值不能再被复制，但是它的指针值却可以。无论什么时候，复制这个指针值，实际上指向的同一个Builder值。

###

### 为什么说strings.Reader类型的值可以高效地读取字符串？

因为在strings.Reader类型的值中，会保存已读取字节的计数，已读计数也代表者下次读取的起始索引位置，它也是读取回退和位置设定时的重要依据。

```go
var reader1 strings.Reader// 省略若干代码。
readingIndex := reader1.Size() - int64(reader1.Len()) // 计算出的已读计数。
```

## Sync同步

> 同步的用途有两个，一个是避免多个线程在同一时刻操作同一个数据块，另一个是协调多个线程，以避免它们在同一时刻执行同一个代码块。

同步其实就是在控制多个线程对共享资源的访问。

临界区总是需要受到同步工具保护的，否则就很可能会产生竟态条件。

![](https://static001.geekbang.org/resource/image/73/6c/73d3313640e62bb95855d40c988c2e6c.png)

### 互斥量mutex

一个互斥锁（互斥量）可以用来保护一个临界区（只要一个代码片段需要实现对共享资源的串行化访问，就可以被视为一个临界区）或者一组相关临界区，可以通过它来保证，在同一时刻只有一个goroutine处于该临界区之内。

为了兑换这个保证，每当有goroutine想进入临界区，都需要先对它进行锁定（Lock方法），并且，每个goroutine离开临界区时，都要及时地对它进行解锁（Unlock方法）。

### 使用互斥锁时有哪些注意事项？

- 不要重复锁定互斥锁

- 不要忘记解锁互斥锁，必要时使用defer语句

- 不要对尚未锁定或者已解锁对互斥锁解锁

- 不要在多个函数之间直接传递互斥锁

忘记解锁导致的panic与死锁导致的panic一样，都是无法恢复的。因此，我们总是应该保证，对于每一个操作，都要有且只有一个对应的解锁操作。

![](https://static001.geekbang.org/resource/image/4f/0d/4f86467d09ffca6e0c02602a9cb7480d.png)

最后，Go语言中的互斥锁是开箱即用的，是一个结构体类型，属于值类型中的一种。把它传给一个函数、将它从函数中返回、把它赋给其他变量、让它进入某个通道都会导致它的副本的产生。并且，原值和它的副本，以及多个副本之间都是完成独立的，它们都是不同的互斥锁。

### 读写锁与互斥锁有哪些异同？

读写锁是读/写互斥锁的简称。在Go语言中，读写锁由Sync.RWMutex类型的值代表，也是开箱即用的。

一个读写锁实际上包含了读锁和写锁。

- Lock方法和Unlock方法分别用于对写锁进行锁定和解锁

- RLock方法和RUnlock方法分别对读锁进行锁定和解锁

**对于某个受到读写锁保护的共享资源，多个写操作不能同时进行，写操作和读操作也不能同时进行，但多个读操作可以同时进行。**

对写锁进行解锁，会唤醒所有因试图锁定读锁，而被阻塞的goroutine，并且，这通常会使它们都成功完成对读锁的锁定。

然而，对读锁进行解锁，只会在没有其他读锁锁定的前提下，唤醒“因试图锁定写锁，而被阻塞的 goroutine”；并且，最终只会有一个被唤醒的 goroutine 能够成功完成对写锁的锁定，其他的 goroutine 还要在原处继续等待。至于是哪一个 goroutine，那就要看谁的等待时间最长了。

**可以通过RLocker()方法获取读锁**

**读写锁和互斥锁都实现了Locker接口**

### 条件变量Cond

条件变量Sync.Cond是基于互斥锁实现的。

> 条件变量并不是被用来保护临界区和共享资源的，它是用于协调想要访问共享资源的那些线程的。当共享资源的状态发生变化时，它可以被用来**通知**被互斥锁阻塞的线程。

### 条件变量怎样与互斥锁配合使用？

> 条件变量的初始化离不开互斥锁，并且它的方法有的也是基于互斥锁的

初始化:

```go
// NewCond returns a new Cond with Locker l.
func NewCond(l Locker) *Cond {
    return &Cond{L: l}
}
```

条件变量提供的方法有三个：

- func (c *Cond) Wait()     // 等待通知

- func (c *Cond) Signal()  // 单发通知

- func (c *Cond) Broadcast()  // 广播通知

### 条件变量的wait方法做了什么？

```go
// Wait atomically unlocks c.L and suspends execution
// of the calling goroutine. After later resuming execution,
// Wait locks c.L before returning. Unlike in other systems,
// Wait cannot return unless awoken by Broadcast or Signal.
//
// Because c.L is not locked when Wait first resumes, the caller
// typically cannot assume that the condition is true when
// Wait returns. Instead, the caller should Wait in a loop:
//
//    c.L.Lock()
//    for !condition() {
//        c.Wait()
//    }
//    ... make use of condition ...
//    c.L.Unlock()
//
func (c *Cond) Wait() {
    c.checker.check()
    t := runtime_notifyListAdd(&c.notify)
    c.L.Unlock()
    runtime_notifyListWait(&c.notify, t)
    c.L.Lock()
}
```

主要做了四件事：

1. 把调用它的 goroutine（也就是当前的 goroutine）加入到当前条件变量的通知队列中。

2. 解锁当前的条件变量基于的那个互斥锁。

3. 让当前的 goroutine 处于等待状态，等到通知到来时再决定是否唤醒它。此时，这个 goroutine 就会阻塞在调用这个Wait方法的那行代码上。

4. 如果通知到来并且决定唤醒这个 goroutine，那么就在唤醒它之后重新锁定当前条件变量基于的互斥锁。自此之后，当前的 goroutine 就会继续执行后面的代码了。

> 条件变量的Wait方法需要在它基于的互斥锁保护下执行，否则就会引发不可恢复的 panic。此外，我们最好使用for语句来检查共享资源的状态，并包裹对条件变量的Wait方法的调用。
> 
> 不要用if语句，因为它不能重复地执行“检查状态 - 等待通知 - 被唤醒”的这个流程。重复执行这个流程的原因是，一个“因为等待通知，而被阻塞”的 goroutine，可能会在共享资源的状态不满足其要求的情况下被唤醒。
> 
> 条件变量的Signal方法只会唤醒一个因等待通知而被阻塞的 goroutine，而它的Broadcast方法却可以唤醒所有为此而等待的 goroutine。后者比前者的适应场景要多得多。
> 
> 这两个方法并不需要受到互斥锁的保护，我们也最好不要在解锁互斥锁之前调用它们。还有，条件变量的通知具有即时性。当通知被发送的时候，如果没有任何 goroutine 需要被唤醒，那么该通知就会立即失效。

![](https://cyent.github.io/golang/img/cond_4.png)

## 原子操作（atomic operation）

原子操作可以完成地消除竟态条件，并能够绝对保证并发安全性。并且，它地执行速度要比其他的同步工具快得多，通常会高出好几个数量级。

不过，它的缺点也很明显。

**更具体地说，正是因为原子操作不能被中断，所以它需要足够简单，并且要求快速**

操作系统层面只针对二进制或整数的原子操作提供了支持。

### sync/atomic包中提供了几种原子操作？可操作的数据类型又有哪些？

golang中原子操作如下：

- 加法（add）

- 比较并交换（CAS，compare and swap）

- 加载（load）

- 存储（store）

- 交换（swap）

数据类型有: int32、int64、uint32、uint64、uintptr以及unsafe包中的Pointer

### unsafe.Pointer

```go
bytes := []byte{104, 101, 108, 108, 111}
p := unsafe.Pointer(&bytes)
str := (*string)(p)
fmt.Println(str, *str)
```

出于安全考虑，Go 语言并不支持直接操作内存，但它的标准库中又提供一种*不安全（不保证向后兼容性）* 的指针类型`unsafe.Pointer`，让程序可以灵活的操作内存。

`unsafe.Pointer`的特别之处在于，它可以绕过 Go 语言类型系统的检查，与任意的指针类型互相转换。也就是说，如果两种类型具有相同的内存结构（layout），我们可以将`unsafe.Pointer`当做桥梁，让这两种类型的指针相互转换，从而实现同一份内存拥有两种不同的**解读**方式。

比如说，`[]byte`和`string`其实内部的存储结构都是一样的，但 Go 语言的类型系统禁止他俩互换。如果借助`unsafe.Pointer`，我们就可以实现在零拷贝的情况下，将`[]byte`数组直接转换成`string`类型。

### atomic.Value

`atomic.Value`被设计用来存储任意类型的数据，所以它内部的字段是一个`interface{}`类型，非常的简单粗暴。

```go
type Value struct {
    v interface{}
}
```

#### 写入操作(Store)

```go
// Store sets the value of the Value to x.
// All calls to Store for a given Value must use values of the same concrete type.
// Store of an inconsistent type panics, as does Store(nil).
func (v *Value) Store(x interface{}) {
    // 存储的值不能是nil
    if x == nil {
        panic("sync/atomic: store of nil value into Value")
    }

    // old value
    vp := (*ifaceWords)(unsafe.Pointer(v))
    // new value
    xp := (*ifaceWords)(unsafe.Pointer(&x))
    for {
        // 通过原子操作获取当前Value中存储的类型
        typ := LoadPointer(&vp.typ)

        // 第一次写入
        if typ == nil {
            // Attempt to start first store.
            // Disable preemption so that other goroutines can use
            // active spin wait to wait for completion; and so that
            // GC does not see the fake type accidentally.
            // 如果typ是nil，那么这是第一次store
            // 禁止运行时抢占，其他goroutine可以进行自旋，直到第一次写入成功
            // runtime_procPin()，它可以将一个goroutine死死占用当前使用的P(P-M-G中的processor)，不允许其它goroutine/M抢占,
            // 使得它在执行当前逻辑的时候不被打断，以便可以尽快地完成工作，因为别人一直在等待它。
            // 另一方面，在禁止抢占期间，GC 线程也无法被启用，这样可以防止 GC 线程看到一个莫名其妙的指向^uintptr(0)的类型（这是赋值过程中的中间状态）。
            runtime_procPin()
            // 使用CAS操作，原子性设置typ为^uintptr(0)这个中间状态。
            // 如果失败，则证明已经有别的线程抢先完成了赋值操作，那它就解除抢占锁，然后重新回到 for 循环第一步。
            if !CompareAndSwapPointer(&vp.typ, nil, unsafe.Pointer(^uintptr(0))) {
                runtime_procUnpin()
                continue
            }
            // Complete first store.
            // 如果CAS设置成功，证明当前goroutine获取到了这个"乐观锁"，可以安全地把v设为传入的新值
            StorePointer(&vp.data, xp.data)
            StorePointer(&vp.typ, xp.typ)
            runtime_procUnpin()
            return
        }

        // 写入进行中...
        // 如果看到typ字段还是^uintptr(0)这个中间类型，证明刚刚的第一次写入还没有完成，
        // 所以它会继续循环，“忙等"到第一次写入完成。
        if uintptr(typ) == ^uintptr(0) {
            // First store in progress. Wait.
            // Since we disable preemption around the first store,
            // we can wait with active spinning.
            continue
        }

        // 走到这里的时候，说明第一次写入已完成
        // First store completed. Check type and overwrite data.
        // 首先检查上一次写入的类型与这一次要写入的类型是否一致，如果不一致则抛出异常。
        if typ != xp.typ {
            panic("sync/atomic: store of inconsistently typed value into Value")
        }

        // 直接把这一次要写入的值写入到data字段
        StorePointer(&vp.data, xp.data)
        return
    }
}
```

这个逻辑的主要思想就是，为了完成多个字段的原子性写入，我们可以抓住其中的一个字段，以它的状态来标志整个原子写入的状态。

流程图：

![](https://blog.betacat.io/image/golang-atomic-value/atomic-value-store.svg)

#### 读取操作(Load)

```go
// Load returns the value set by the most recent Store.
// It returns nil if there has been no call to Store for this Value.
func (v *Value) Load() (x interface{}) {
    vp := (*ifaceWords)(unsafe.Pointer(v))
    typ := LoadPointer(&vp.typ)
    // 如果typ为nil或者中间类型^uintptr(0)，那么说明第一次写入还没有完成，那就直接返回nil
    if typ == nil || uintptr(typ) == ^uintptr(0) {
        // First store not yet completed.
        return nil
    }

    // 到这里，说明第一次写入已成功
    // 根据已有到typ和data，构建一个interface返回
    data := LoadPointer(&vp.data)
    xp := (*ifaceWords)(unsafe.Pointer(&x))
    xp.typ = typ
    xp.data = data
    return
}
```

#### 总结

原子操作由底层硬件支持，而锁则由操作系统提供的 API 实现。若实现相同的功能，前者通常会更有效率，并且更能利用计算机多核的优势。所以，以后当我们想并发安全的更新一些变量的时候，我们应该优先选择用atomic.Value来实现。

使用规则：

- 不能用atomic.Value原子值存储nil

- 我们向原子值存储的第一个值，决定了它今后能且只能存储哪一个类型的值

> 建议：不要把内部使用的atomic.Value原子值暴露给外界，如果非要暴露也要通过API封装形式，做严格的check。



### Sync.WaitGroup



sync.WaitGroup底层是使用计数器和信号量来实现同步的。



> 不要把增加其计数器值的操作和调用其Wait方法的代码，放在不同的goroutine中执行。换句话说，要杜绝对同一个WaitGroup值的两种操作的并发执行。



#### 信号量

信号量是Unix系统提供的一种保护共享资源的机制，用于防止多个线程同时访问某个资源。

可简单理解为信号量为一个数值：

-  当信号量>0时，表示资源可用，获取信号量时系统自动将信号量减1；

- 当信号量==0时，表示资源暂不可用，获取信号量时，当前线程会进入睡眠，当信号量为正时被唤醒；



#### 内存对齐





参考：

 [Go WaitGroup实现原理 - 恋恋美食的个人空间 - OSCHINA](https://my.oschina.net/renhc/blog/2249061)

[Go WaitGroup实现原理_weixin_34259159的博客-CSDN博客_go waitgroup](https://blog.csdn.net/weixin_34259159/article/details/91699572)

[sync.WaitGroup实现原理详解](https://memosa.cn/golang/2019/10/31/golang-waitgroup.html)

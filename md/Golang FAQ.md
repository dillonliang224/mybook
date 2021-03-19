[TOC]

# 参考

- [Frequently Asked Questions (FAQ)](https://go-zh.org/doc/faq)
- [Awesome Go Interview Questions and Answers](https://goquiz.github.io/)

# Go 综合

## Go语言的特点

Golang 结合了动态语言的高效，以及静态语言的安全

- 语法简洁，上手快
- 性能高，编译快，开发效率也不低
- 原生支持并发，goroutine 的开销比线程小的多
- 自带垃圾回收
- 格式化工具，以及各种静态分析工具

## 对 Go 的评价

- 易于维护：代码写完之后几个月再去看完全没有生疏感；golmt 这个格式化工具，让团队中所有人的代码风格都是一样的。
- 有 C 语言的优势，没有 C++ 的弱点。Go 是强类型语言，**任何严肃的软件项目都不应该选择使用弱类型语言**；Go 的 interface 能满足 90%以上的 OOP 需求，但又没有 C++ 的种种陷阱；执行速度足够快。
- 很好的 import. Build 和 profile 功能。import 一个 GitHub 的就好像使用本地目录，天然解决了开源软件中的协同开发的问题；profile 能力强大；build standalone binary 简单部署。
- goroutines 提供了天然的并发编程支持。go 也是微服务最好的语言：native web 框架，gPRC, docker

## Go 适合做什么

- 适合微服务，兼顾开发效率和运行效率
- 高性能的基础组件
- 命令行工具

## Go 不适合做什么

实时性要求很高的系统：因为垃圾回收和自动内存分配的原因

## 为什么从 nodejs 转到 golang

追书这个项目大概是从12年开始一直到现在，主要的API基本都在一个服务中，也就是所谓的巨石架构。

存在的问题就是：

- 项目大概有40w行代码，各个模块之间区别比较模糊，逻辑混乱，难以维护。
- 持续集成、部署速度都变的很慢，并且服务也无法按需伸缩

项目的nodejs代码比较旧了，node版本是v4的，目前最新的LTS已经到v10了，升级的话会面临很多第三方库不兼容的问题。

所以，就开始了重构的工作。因为我们打算先重构一些比较重要的业务，比如用户服务，书籍服务，计费服务等，所以我们需要一门静态编译型语言，它的可靠性比脚本语言要高。经过选型后，我们确定使用了 Golang，然后 golang 的优点 balabal。

> 任何严肃的软件项目都不应该选择使用弱类型语言

参考：[From Nodejs To Go](https://github.com/golang/go/wiki/FromXToGo#Node)

## 学习 Go 的主要途径？读过那些书？

官方文档、书籍、源码

读过哪些书：

- 《Go程序设计语言》
- 《Go学习笔记》
- 《Go语言实战》
- 《Go Web 编程》

## Go changelog

- Go 1.5 彻底移除C代码，Runtime、Compiler、Linker 均由Go编写，实现自举
- Go 1.7 改进 GC
- Go 1.11 引入 Go Module 包管理

## Go 使用踩过什么坑

- for 循环的 i 使用相同的地址。
- map 的值如果是非指针结构体的话，无法直接赋值。
- 两个 uint 相减如果是负数会是一个很大的 uint

## Golang 面向对象总结

Go 没有类，而是用松耦合的类型方法对接口的实现。

OO 语言最重要的三个方面分别是：封装，继承和多态，在 Golang 里：

- 封装：通过首字母大小写，区分是否导出
- 继承：用组合实现，在结构体里内嵌其他类型
- 多态：用接口实现，某个类型只要实现了接口定义的方法，就算实现了该接口

## 包系统和编译

Go语言的闪电般的编译速度主要得益于三个语言特性:

- 所有导入的包必须在每个文件的开头显式声明，这样的话编译器就没有必要读取和分析整个源文件来判断包的依赖关系。

- 禁止包的环状依赖，因为没有循环依赖，包的依赖关系形成一个有向无环图，每个包可以被独立编译，而且很可能是被并发编译。

- 编译后包的目标文件不仅仅记录包本身的导出信息，目标文件同时还记录了包的依赖关系。因此，在编译一个包的时候，编译器只需要读取每个直接导入包的目标文件，而不需要遍历所有依赖的的文件(译注:很多都是重复的间接依赖)。

## 为什么Go没有泛型？

泛型是方便的，但同时会增加类型系统与运行时的复杂性。 

## 为什么Go没有异常处理？

Go 团队认为 try-catch-finally 的语法会导致代码难以理解。

## 为什么使用Go程而非线程？

goroutine 是一种线程的多路复用，比线程开销低

Go程是让使发易于使用的一部分。这个想法已经存在了一段时间，它是将独立执行的函数—— 协程——多路复用到一组线程上。当协程被阻塞，如通过调用一个阻塞的系统调用时， 运行时会在相同的操作系统线程上自动将其它的协程转移到一个不同的，可运行的， 不会被阻塞的线程上。重点是程序员不会看见。结果，我们称之为Go程，可以非常廉价： 除非它们在在长期运行的系统调用上花费了大量的时间，否则它们只会花费比栈多一点的内存， 那只有几KB而已。

为了使栈很小，Go的运行时使用了分段式栈。一个新创建的Go程给定几KB，这几乎总是足够的。 当它不够时，运行时会自动地分配（并释放）扩展片段。每个函数调用平均需要大概三条廉价的指令。 这实际上是在相同的地址空间中创建了成百上千的Go程。如果Go程是线程的话，系统资源会更快地耗尽。

## Go 为什么没有类型继承

不同于传统的OO语言，Go中的类型可以通过定义方法来自动满足任何接口，而不需要提前声明两个类型的关联，很灵活，这种隐式的类型依赖是Go中最具生产力的东西之一，同时它没有传统多重继承的复杂性。

## 简要描述一个go可执行文件的引导过程。

```go
Run the platform-specific assembly that is located under $GOROOT/src/runtime/
runtime·args(): Parse terminal arguments
runtime·osinit(): Initialize CPU cores
runtime·schedinit(): Initialize goroutine scheduler, stack memory, terminal arguments, environment variables, debug parameter, gc, GOMAXPROCS, ...
runtime·mstart(): Start gc monitor, enable gc, import dependencies and run init() functions, finally run main.main()
```

## runtime 的作用

运行时系统（runtime system）主要实现执行模型（execution model）的一部分。

它提供了运行程序的环境，该环境可以解决许多问题，包括：

- 管理程序内存，stack 和 heap，GC
- 管理线程，goroutine
- 程序如何访问变量，传递参数
- 与操作系统的接口
- 类型检查、代码优化
- ...

# 数据类型

## Go声明变量时为什么把类型放在变量名称的后面？

为了避免像 C 语言中那样含糊不清的声明形式，例如：int* a, b;。在这个例子中，只有 a 是指针而 b 不是。如果你想要这两个变量都是指针，则需要将它们分开写。

> See https://blog.golang.org/gos-declaration-syntax

## 列出 Golang 所有数据类型

```sh
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // uint8 的别名，用于强调数值是一个原始的数据而不是一个小的整数

rune // int32 的别名，表示一个 Unicode 码点

float32 float64

complex64 complex128
```

## uint 相减的值是负数会发生什么

uint 相减结果如果是负数的话，会变成一个很大的 uint 值。

```go
func main() {
    var a uint = 1
    var b uint = 2
    c := a - b
    fmt.Println(c)  // 打印 18446744073709551615
}
```

# 语句

## Go 赋值和函数传参的规则

除了闭包函数以引用的方式对外部变量访问之外，其它赋值和函数传参数都是以传值的方式处理。

## new 与 make 的区别

- new 和 make 都在堆上分配内存
- new 不限制类型，而 make 只能用于 slice、map、channel
- new 返回指向类型 T 的指针，类型T为零值，不初始化内存；make 返回初始化过的类型 T 的值

## make 命令创建的缓冲区被分配了一块内存后，如何销毁缓冲区并收回内存？

在运行时，buffer = nil 将启动垃圾回收。

## for 循环

for 循环和 for range 循环在遍历时，循环变量的地址总是相同的。

---

下面的代码会输出什么？

```go
func main() {
    s := []int{1, 2, 3}

    var wg sync.WaitGroup
    wg.Add(len(s))

    for _, v := range s {
        go func() {
            fmt.Println(v)
            wg.Done()
        }()
    }

    wg.Wait()
}

// 打印3个3
```

解决方案：

```go
// 传参，在每次迭代时计算 v 并将其放置在goroutine的堆栈上
for _, v := range s {
    go func(v interface{}) {
        fmt.Println(v)
        wg.Done()
    }(v)
}

// 创建局部变量作为闭包
for _, v := range s {
    v := v
    go func() {
        fmt.Println(v)
        wg.Done()
    }()
}
```

---

下面的代码会输出什么，并说明原因。

```go
func main() {
    runtime.GOMAXPROCS(1)
    wg := sync.WaitGroup{}
    wg.Add(20)
    for i := 0; i < 10; i++ {
        go func() {
            fmt.Println("A: ", i)
            wg.Done()
        }()
    }
    for i := 0; i < 10; i++ {
        go func(i int) {
            fmt.Println("B: ", i)
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

A会输出10个10，B会输出0~9（顺序不定）

- 第一个go func中 i 是外部for的一个变量，地址不变化。遍历完成后，最终i=10。 故go func执行时，i的值始终是10。
- 第二个go func中 i 在传参时发生拷贝，与外部for中的 i 完全是两个变量。

# Defer

参考：https://studygolang.com/articles/16067

defer 函数会将函数推迟到外层函数返回后执行，通常用于释放资源和错误处理。

原理：当外层函数返回时，被推迟的函数会按照后进先出的顺序调用。

defer 的行为规则：

- 规则一：延迟函数的参数在defer语句出现时就已经确定下来了
- 规则二：延迟函数执行按后进先出顺序执行，即先出现的defer最后执行
- 规则三：延迟函数可以操作主函数的具名返回值

函数的 return value 不是原子操作.而是在编译器中分解为两部分：设置返回值->return 。defer 实际执行在返回前，过程是：`设置返回值 -> 执行defer -> return`。故可以在defer函数中修改返回值。

defer 的参数会立即求值，并复制一份，后续实参的修改不会影响 defer 的参数。

如果主函数没有使用具名返回值，defer语句是没法操作返回值的。

- 如果返回字面量，如：`return 1`，该值会直接写入栈中作为返回值，defer无法操作该值。
- 如果返回局部变量，如：`return i`，该值会拷贝给一个匿名返回值变量，defer 可以修改该局部变量，但是对返回值没有影响。

一般而言，当panic异常发生时，程序会中断运行，并立即执行在该goroutine 中被延迟的函数(defer机制)。随后，程序崩溃并输出日志信息。日志信息包括panic value和函数调用的堆栈跟踪信息。

## 为什么 defer 要设计成 FIFO

设计defer的初衷是简化函数返回时资源清理的动作，资源往往有依赖顺序，比如先申请A资源，再跟据A资源申请B资源，跟据B资源申请C资源，即申请顺序是:A-->B-->C，释放时往往又要反向进行。这就是把deffer设计成FIFO的原因。

## defer 的实现

源码包 src/src/runtime/runtime2.go:_defer 定义了defer的数据结构：

```go
type _defer struct {
    sp      uintptr   //函数栈指针
    pc      uintptr   //程序计数器
    fn      *funcval  //函数地址
    link    *_defer   //指向自身结构的指针，用于链接多个defer
}
```

defer的数据结构跟一般函数类似，也有栈地址、程序计数器、函数地址等等。另外还有一个指针，可用于指向另一个defer。

每个goroutine数据结构中有一个defer指针，该指针指向一个defer的单链表:

- 每次声明一个defer时就将defer插入到单链表表头（runtime.deferproc）
- 每次执行defer时就从单链表表头取出一个defer执行（runtime.deferreturn）

下图展示一个goroutine定义多个defer时的场景： 

![image](http://note.youdao.com/yws/res/132200/BD0A7D6FE4784977B3094FBDA01CC1B0)

函数返回前执行defer则是从链表首部依次取出执行，不再赘述。

一个goroutine可能连续调用多个函数，defer添加过程跟上述流程一致，进入函数时添加defer，离开函数时取出defer，所以即便调用多个函数，也总是能保证defer是按FIFO方式执行的。

源码包src/runtime/panic.go定义了两个方法分别用于创建defer和执行defer。

- deferproc()： 在声明defer处调用，其将defer函数存入goroutine的链表中；
- deferreturn()：在return指令，准确的讲是在ret指令前调用，其将defer从goroutine链表中取出并执行。

可以简单这么理解，在编译在阶段，声明defer处插入了函数deferproc()，在函数return前插入了函数deferreturn()。

## Questions

```go
package main

import (
    "fmt"
)

func main() {
    defer_call()
}

func defer_call() {
    defer func() { fmt.Println("打印前") }()
    defer func() { fmt.Println("打印中") }()
    defer func() { fmt.Println("打印后") }()

    panic("触发异常")
}  
```

输出 ：

```sh
打印后
打印中
打印前
panic: 触发异常
```

---

下面代码输出什么？

```go
func calc(index string, a, b int) int {
    ret := a + b
    fmt.Println(index, a, b, ret)
    return ret
}

func main() {
    a := 1                                             //line 1
    b := 2                                             //2
    defer calc("1", a, calc("10", a, b))  //3
    a = 0                                              //4
    defer calc("2", a, calc("20", a, b))  //5
    b = 1                                              //6
}
```

答 输出结果为：

```sh
10 1 2 3
20 0 2 2
2 0 2 2
1 1 3 4
```

---

是否可以编译通过？如果通过，输出什么？

```go
package main

func main() {
    println(DeferFunc1(1))
    println(DeferFunc2(1))
    println(DeferFunc3(1))
}

func DeferFunc1(i int) (t int) {
    t = i
    defer func() {
        t += 3
    }()
    return t
}

func DeferFunc2(i int) int {
    t := i
    defer func() {
        t += 3
    }()
    return t
}

func DeferFunc3(i int) (t int) {
    defer func() {
        t += i
    }()
    return 2
}
```

答：输出 4 1 3；如果主函数没有使用具名返回值，defer是无法操作返回值的。

---

下面代码输出什么?

```go
func main() {
    defer func() {
        if err := recover(); err != nil {
            fmt.Print(err)
        } else {
            fmt.Print("no")
        }

    }()
    defer func() {
        panic("1111111111111")
    }()
    panic("22222222222")

}
```

答：输出 1111111111111；

执行顺序：

```sh
1. panic("22222222222") panic向上传递
2. panic("1111111111111") panic向上传递
3. recover() 接收panic,打印最后一个panic
```

# Function

## 闭包

下面代码输出什么？

```go
func test(x int) (func(),func())  {
    return func() {
        println(x)
        x+=10
    }, func() {
        println(x)
    }
}

func main()  {
    a,b:=test(100)
    a()
    b()
}
```

输出：100 110；闭包引用相同的变量

## Init 函数

init函数:

- 先初始化导入的包，然后初始化所有全局变量，再执行 init 函数；
- 在所有 init 函数结束后才执⾏ main 函数。
- 每个包可以包含任意多个 init 函数
- 不能手动调用 init 函数。
- init 函数在单⼀线程被调用，仅执行一次。
- 不应该滥⽤ init 函数，仅适合完成当前⽂件中的相关环境设置。

![image](http://note.youdao.com/yws/res/111382/9F5CC5C3A58248149BC164D523FC46DB)

# Panic

## recover 原理

当 panic 被调用后（包括不明确的运行时错误，例如切片检索越界或类型断言失败）， 程序将立刻终止当前函数的执行，并开始回溯 goroutine 的栈，运行任何被推迟的函数。 若回溯到达 goroutine 栈的顶端，程序就会终止。不过我们可以用内建的 recover 函数来重新取回 goroutine 的控制权限并使其恢复正常执行。调用 recover 将停止回溯过程，并返回传入 panic 的实参。 由于在回溯时只有被推迟函数中的代码在运行，因此 recover 只能在被推迟的函数中才有效。

## Questions

下面代码打印什么?

```go
func f1() {
    defer println("f1-begin")
    f2()
    defer println("f1-end")
}

func f2() {
    defer println("f2-begin")
    f3()
    defer println("f2-end")
}

func f3() {
    defer println("f3-begin")
    panic(0)
    defer println("f3-end")
}

func main() {
    f1()
}
```

答：打印

```
f3-begin
f2-begin 
f1-begin 
panic: 0
```

---

下面代码会打印什么？

```go
func f() {
    defer func() {
        if r := recover(); r != nil {
            log.Printf("recover:%#v", r)
        }
    }()
    panic(1)
    panic(2)
}

func main() {
    f()
}
```

答：打印 recover: 1。 panic(1) 是会立即停止函数的执行，然后运行 defer 函数，所以 panic(2) 是不可达的。

# String

修复下面的错误，以确保可以正确打印utf8字符串的长度。

```go
func main() {
    fmt.Println(len("你好"))
}

// 改成:
func main() {
    fmt.Println(utf8.RuneCountInString("你好"))
    len([]rune(str))
    bytes.Count([]byte(str), nil) -1
    strings.Count(str, "") -1
}
```

---

如何将 []byte 转成字符串而不会导致内存分配？

```go
func main() {
    var b = []byte("123")
    s := *(*string)(unsafe.Pointer(&b))

    b[1] = '4'
    fmt.Printf("%+v\n", s) //print 143
}
```

---

下面代码输出什么？

```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println(len("你好bj!"))
}
```

答：输出9；每个中文字，占3个byte。在 Go 中，字符串是以 UTF-8 为格式进行存储的，在字符串上调用 len 函数，取得的是字符串包含的 byte 的个数。

# Struct

## struct 能不能比较

可以比较，但是必须是相同类型，并且 struct 中全部类型都是可比较的，比如包含 slice、map 等类型就不能比较了。

## 组合

下面代码会输出什么？

```go
type People struct{}

func (p *People) ShowA() {
    fmt.Println("showA")
    p.ShowB()
}
func (p *People) ShowB() {
    fmt.Println("showB")
}

type Teacher struct {
    People
}

func (t *Teacher) ShowB() {
    fmt.Println("teacher showB")
}

func main() {
    t := Teacher{}
    t.ShowA()
}
```

答： 将输出：

```
showA
showB
```

被组合的类型People所包含的方法虽然升级成了外部类型Teacher这个组合类型的方法，但他们的方法(ShowA())调用时接受者并没有发生变化。毕竟这个People类型并不知道自己会被什么类型组合，当然也就无法调用方法时去使用未知的组合者Teacher类型的功能。

因此这里执行t.ShowA()时，在执行ShowB()时该函数的接受者是People，而非Teacher。

## 方法

以下代码能编译过去吗？为什么？

```go
type People interface {
    Speak(string) string
}

type Stduent struct{}

func (stu *Stduent) Speak(think string) (talk string) {
    if think == "bitch" {
        talk = "You are a good boy"
    } else {
        talk = "hi"
    }
    return
}

func main() {
    var peo People = Stduent{}
    think := "bitch"
    fmt.Println(peo.Speak(think))
}
```

答： 编译失败，值类型 Student{} 未实现接口People的方法，不能定义为 People类型。需改成：`var peo People = &Stduent{}`

# Slice

## slice 的实现

slice 底层是一个结构体，有三个字段：指向底层数组的指针、长度、容量。

```go
type slice struct {
    array unsafe.Pointer
    len   int
    cap   int
}
```

![image](http://note.youdao.com/yws/res/138368/ADF49E30BE834168AE78F369614D4E37)

slice 的赋值和传参其实就是复制这个结构体，并不会复制底层数组。进行切片操作就是创建一个新的 slice 结构体，然后改变指针和长度。

当切片需要扩容的时候，会创建一个新的更大的底层数组，然后将现有值copy到新的数组中，再追加值。

扩容规则（cap表示最终容量）：

1. 如果新申请的容量大于2倍的旧容量，cap等于新申请的容量
2. 否则判断：
   - 如果旧切片的长度<1024，cap等于旧容量的2倍
   - 如果旧切片的长度>=1024，cap从旧容量开始循环增加原来的1/4，直到cap大于新申请的容量；如果cap计算时溢出，cap就等于新申请的容量

## nil 切片和空切片的区别

- nil 切片底层指针指向 nil
- 空切片底层指针指向一个内存地址，该地址还没有分配内存空间
- 对 nil 切片和空切片调用 append、len、cap 函数效果都是一样的。

前者声明了一个nil的，len和cap也为0的。后者声明了一个non-nil的，len和cap也为0。区别是后者已经分配了内存地址，前者只是栈上的slice引用。还需要区别的一点是json化时，前者会导致字段设置为null，如 xxx:null，后者则是xxx:[]。

## 数组与切片的区别

简单来说，切片相比数组而言，占用更少内存、创建更加便捷、使用更加灵活，但切片本质上还是数组。

- 数组的长度是固定的，切片是可变长的
- 数组的赋值和传参会复制整个底层数据，切片只会复制头信息的结构，不会复制底层数据。
- 数组是可比较的，可以作为 map 的 key，而切片是不可比较的。
- 数组可以提供更高的编译时安全性，因为可以在编译时检查索引边界。

## 切片传参的字节数

在 64 位架构的机器上，一个切片需要 24 字节的内存:指针字段需要 8 字节，长度和容量字段分别需要 8 字节。

## 切片的底层数组什么时候会被替换

确切地说，一个切片的底层数组永远不会被替换。为什么？虽然在扩容的时候 Go 语言一定会生成新的底层数组，但是它也同时生成了新的切片。它是把新的切片作为了新底层数组的窗口，而没有对原切片及其底层数组做任何改动。

请记住，在无需扩容时，append 函数返回的是指向原底层数组的新切片，而在需要扩容时 append 函数返回的是指向新底层数组的新切片。

所以，严格来讲，“扩容”这个词用在这里虽然形象但并不合适。不过鉴于这种称呼已经用得很广泛了，我们也没必要另找新词了。

顺便说一下，只要新长度不会超过切片的原容量，那么使用 append 函数对其追加元素的时候就不会引起扩容。这只会使紧邻切片窗口右边的（底层数组中的）元素被新的元素替换掉。

## JSON 标准库对 nil slice 和 空 slice 的处理是一致的吗？

- 空 slice 在 json 编码时，解析成空数组
- nil slice 在 json 编码时，解析成 null

```go
c := make(map[string]interface{})
c["slice"] = []int{}        // 空 slice
data, _ := json.Marshal(c)
fmt.Println(string(data))   // 打印：{"slice":[]}
```

```go
c := make(map[string]interface{})
c["slice"] = make([]int, 0) // 空 slice
data, _ := json.Marshal(c)
fmt.Println(string(data))   // 打印：{"slice":[]}
```

```go
c := make(map[string]interface{})
var s []int
c["slice"] = s              // nil slice
data, _ := json.Marshal(c)
fmt.Println(string(data))   // 打印：{"slice":null}
```

## 题目

请写出以下输入内容

```go
func main() {
    s := make([]int, 5)     // s = [0 0 0 0 0]
    s = append(s, 1, 2, 3)
    fmt.Println(s)
}
```

答：输出：[0 0 0 0 0 1 2 3]

---

下面是否可以编译通过?

```go
func main() {
    list := new([]int)
    list = append(list, 1)
    fmt.Println(list)
}
```

不能，因为 append 只能作用域 slice，而不能是 slice 的地址，改成 `*list = append(*list, 1)` 即可。

--- 

结构体切片的排序：

```go
type S struct {
    v int
}

func main() {
    s := []S{{1}, {3}, {5}, {2}}
    sort.Slice(s, func(i, j int) bool { return s[i].v < s[j].v })
    fmt.Printf("%#v", s)
}
```

---

执行下面代码输出什么？

```go
func main() {
    five := []string{"Annie", "Betty", "Charley", "Doug", "Edward"}

    for _, v := range five {
        five = five[:2]
        fmt.Printf("v[%s]\n", v)
    }
}
```

输出：five 的 5 个值。

循环将在切片的副本上进行，five 的修改不影响副本的遍历。

---

下面代码会打印出什么？

```go
func main() {
    s := []int{1, 2, 3}
    ss := s[1:]
    ss = append(ss, 4)

    for i := range ss {
        ss[i] += 10
    }

    fmt.Println(s)
}
```

答：输出 [1 2 3]，因为 ss 在追加 4 的时候底层数据已经复制到新的数组了。

---

下面代码会打印出什么？

```go
func main() {
    a := []int{1, 2, 3, 4}
    b := a[0:1]
    c := append(b, 1)
    fmt.Println(a, b, c)
    // a [1 1 3 4]
    // b [1]
    // c [1 1]
}
```

b为a的切片，长度为1，容量为4，共享底层数组；对b的追加操作会应用在底层数组下标1的位置，所以会影响a的值。

---

```go
func main(){
    s := []int{5}
    s = append(s, 7)
    s = append(s, 9)
    x := append(s, 11)
    y := append(s, 12)
   fmt.Println(s, x, y) // s=[5 7 9] x=[5 7 9 11] y=[5 7 9 12]
}
```

解答：

1. 创建s时，cap(s) == 1，内存中数据[5]
2. append(s, 7) 时，按Slice扩容机制，cap(s)翻倍 == 2，内存中数据[5,7]
3. append(s, 9) 时，按Slice扩容机制，cap(s)再翻倍 == 4，内存中数据[5,7,9]，但是实际内存块容量4
4. x := append(s, 11) 时，容量足够不需要扩容，内存中数据[5,7,9,11]
5. y := append(s, 12) 时，容量足够不需要扩容，内存中数据[5,7,9,12]

# Map

## map 的实现

map 的定义在 src/runtime/map.go：

```go
type hmap struct { 
    count     int       // map的大小，即有多少kv对
    flags     uint8     // 状态标志
    B         uint8     // 说明包含 2^B 个 bucket
    noverflow uint16    // 溢出的 bucket 的个数 
    hash0     uint32    // hash 种子

    buckets    unsafe.Pointer // buckets 的数组指针
    oldbuckets unsafe.Pointer // 用于扩容的 buckets 数组
    nevacuate  uintptr        // 迁移进度（已经迁移的 buckets 数量）

    extra *mapextra // optional fields
}

type bmap struct {
    tophash [bucketCnt]uint8    // bucketCnt = 8
}
```

map 底层实现是哈希表，使用链表解决冲突。

map的底层结构是 hmap，核心元素是一个由若干个桶（bucket，结构为bmap）组成的数组，每个桶可以存放8个元素，key通过哈希算法被归入不同的桶中。

桶的类型为 bmap，里面包含一个长度为 8 的数组 tophash，用于记录 key 哈希值的高8位。这样在寻找对应key的时候可以更快，不必每次都对key做全等判断（传统的hash链式解决方案找到数组下标后需要依次比对key）。tophash 数组之后跟着8个 kv 对和一个 overflow 指针，这两个属性没有显示定义，而是直接通过指针运算访问。

![image](http://note.youdao.com/yws/res/137894/F0574E19B0CE4F4599FCBB166A1FD9F5)

kv的存储形式为 `k0k1k2k3…k7v1v2v3…v7`，这样做的好处是：字节对齐，在key和value的长度不同的时候，节省padding空间。如在map[int64]int8中，4个相邻的int8可以存储在同一个内存单元中。如果使用kv交错存储的话，每个int8都会被padding占用单独的内存单元（为了提高寻址速度）。

![image](http://note.youdao.com/yws/res/137888/DB26BCBF1F2C4FF1917F13E5E33DF896)

map 的增删改查：

- 查询的时候用 key 哈希值的低B位找到 bucket 数组的下标，得到一个 bmap。用 key 哈希值的高8位比对 bmap 里 tophash 数组的值。在当前 bmap 的 tophash 里找不到会通过 overflow 指针到下一个链接的 bmap 里去找。如果找到，就可以通过 tophash 的下标进行偏移找到 key 和 value。

- 存值的时候和查询一样查找key，找到就更新，找不到就将 key 存入 tophash 数组中空的位置。如果当前 tophash 已满，就再分配一个 bmap 存入该 key，并将当前 bmap 的 overflow 指针指向新分配的 bmap。

- 删除操作不会收缩空间，只是将对应的 tophash[i] 设置为空，保留内存以待后续使用。

map的扩容：

- 扩容的时机：在没有溢出时 hashmap 总共可以存储 `8*2^B` 个KV对，当hashmap已经存储到 `6.5*2^B` 个KV对时表示hashmap已经趋于溢出，即很有可能在存值时用到overflow链表。为了保证哈希表的性能，需要进行扩容。

- 扩容的具体操作：渐进式扩容，在每次 insert 或 remove 时迁移1到2个kv对。

## map 的 key 不能是什么类型

key 只能是可比较的类型，不能是 func、map、slice。

## 为什么 map 的 key 是随机的

为了让程序不依赖 map 返回的 key 的顺序。

## map 如何顺序读取 key

先把 key 取出来放入切片中，然后对切片进行排序，然后遍历切片，依次取 map 里的值。

```go
func main() {
    var m = map[string]int{
        "hello":         0,
        "morning":       1,
        "my":            2,
        "girl":           3,
    }
    var keys []string
    for k := range m {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    for _, k := range keys {
        fmt.Println("Key:", k, "Value:", m[k])
    }
}
```

## map 的并发竞争

从go1.6开始，runtime会对并发读写map进行检测，一旦检测到有并发读写map的情况，会引发crash。

下面代码并发安全吗？

```go
func loadIcons() {
    icons = map[string]image.Image{
        "spades.png": loadIcon("spades.png"),
        "hearts.png": loadIcon("hearts.png"), 
        "diamonds.png": loadIcon("diamonds.png"), 
        "clubs.png": loadIcon("clubs.png"),
    } 
}
// NOTE: not concurrency‐safe!
func Icon(name string) image.Image { 
    if icons == nil {
        loadIcons() // one‐time initialization 
    }
    return icons[name] 
}
```

不安全，因为一个 goroutine 可能只是初始化了map，并未填值，然后另一个 goroutine 检测到不为空，就直接返回，导致出错。

## Questions

请说出下面代码，执行时为什么会报错

```go
type Student struct {
    name string
}

func main() {
    m := map[string]Student{"people": {"zhoujielun"}}
    m["people"].name = "wuyanzu"
}
```

编程报错 cannot assign to struct field m["people"].name in map。

因为 m["people"] 不是一个普通的指针值，map的value本身是不可寻址的，因为map中的值会在内存中移动，并且旧的指针地址在map改变时会变得无效。

# Interface

## interface 的实现

可以看出 iface 比 eface 中间多了一层itab结构。 itab 存储_type信息和[]fun方法集，从上面的结构我们就可得出，因为data指向了nil 并不代表interface 是nil， 所以返回值并不为空，这里的fun(方法集)定义了接口的接收规则，在编译的过程中需要验证是否实现接口 结果：

```go
type eface struct {      //空接口
    _type *_type         //类型信息
    data  unsafe.Pointer //指向数据的指针(go语言中特殊的指针类型unsafe.Pointer类似于c语言中的void*)
}
type iface struct {      //带有方法的接口
    tab  *itab           //存储type信息还有结构实现方法的集合
    data unsafe.Pointer  //指向数据的指针(go语言中特殊的指针类型unsafe.Pointer类似于c语言中的void*)
}
type _type struct {
    size       uintptr  //类型大小
    ptrdata    uintptr  //前缀持有所有指针的内存大小
    hash       uint32   //数据hash值
    tflag      tflag
    align      uint8    //对齐
    fieldalign uint8    //嵌入结构体时的对齐
    kind       uint8    //kind 有些枚举值kind等于0是无效的
    alg        *typeAlg //函数指针数组，类型实现的所有方法
    gcdata    *byte
    str       nameOff
    ptrToThis typeOff
}
type itab struct {
    inter  *interfacetype  //接口类型
    _type  *_type          //结构类型
    link   *itab
    bad    int32
    inhash int32
    fun    [1]uintptr      //可变大小 方法集合
}
```

## interface 什么情况下为空

接口值由两部分组成，一个是具体的类型，一个是具体类型的值。

接口的零值需要它的具体类型和值都是 nil，比如：`var w io.Writer`

## Questions

ABCD中哪一行存在错误？

```go
type S struct {
}

func f(x interface{}) {
}

func g(x *interface{}) {
}

func main() {
    s := S{}
    p := &s
    f(s) //A
    g(s) //B
    f(p) //C
    g(p) //D

}
```

答：B 和 D 会报错。

解析：interface{} 接收任意值，而 *interface{} 只是接收 *interface{} 类型。

# Goroutine

## 什么是 goruntine

**协程的思想本质上就是控制流的主动让出(yield)和恢复(resume)机制”的理解**

goroutine 是一种函数的并发执行方式，是一种线程的多路复用，占用的资源远少于线程（G 的stack 默认为 2k，Thread 的 stack 默认为 8M，64位系统）。

goroutine 使用了 G-P-M 模型：

- G：goroutine的核心结构，存储了goroutine的栈、程序计数器，以及其他一些重要的调度信息，每个 G 中 sched 保存着其上下文信息.
- P：上下文，也称逻辑处理器，P 的数量决定了最大并行的G的数量。P 维护了一个本地 G 队列，mcache 和状态等。
- M：内核级线程，在绑定有效的 P 后（一个P绑定一个M），进入schedule循环：从队列中获取G，切换到G的执行栈上并执行G的函数，调用goexit做清理工作并回到M，如此反复。

Sched：调度器，由 Go runtime 实现，维护了全局的G队列和线程池以及一些状态信息。

![image](https://note.youdao.com/yws/res/124738/BFBBCCFCA5BE442396D50FB28AD3852F)

当我们创建一个goroutine后， 会先将 G 存放在全局运行队列中，P 会周期性地检查全局运行队列，并将队列中的 G 放入 P 自身的本地队列中，然后将 G 调度到 M 中执行。当 G 执行了一段时间后（抢占），将上下文保存下来，然后加入到 P 的队列尾部，接着从队列中重新取出一个 G 进行调度。

Go运行时实现了抢占式调度，防止某个 goroutine 长时间运行。在 Go 程序启动时，runtime 会启动一个名为sysmon的M（监控线程），该M无需绑定p即可运行，这个线程每隔一段时间进行：

- 释放闲置超过5分钟的span物理内存；
- 如果超过2分钟没有垃圾回收，强制执行；
- 将长时间未处理的netpoll结果添加到任务队列；
- 向长时间运行的G任务发出抢占调度（10ms）；
- 收回因syscall长时间阻塞的P；

G 进行系统调用：

- 如果 G 阻塞在某个系统调用上（如打开一个文件），这时候，对应的 M 会阻塞等待 I/O 返回。这种情况下 M 会和 P 解绑（实质上是被监控线程抢走了），然后 P 会再选择一个空闲的 M 或新建一个 M 进行绑定，继续执行本地运行队列里的其他 G。当 M 完成阻塞的系统调用后，会尝试获取一个可用的 P 来运行 G，如果没有可用的 P，就会将 G 标记为 runnable，然后放到全局运行队列中，M 再放回线程池。

G 进行网络I/O：

- Go runtime 还实现了 netpoller。netpoller 接收由 goroutine 产生的网络 I/O 事件，使用 epoll 来轮询 socket。当 G 进行网络 I/O 阻塞时，就会被放入等待队列中，然后将它的fd设置为非阻塞，再以边缘触发方式注册到epoll实例中，然后定期进行 epoll_wait 来检测 fd 的状态，如果 fd 就绪，就将 G 设置为 runnable 放回调度队列中等待调度执行。这样的话，网络 I/O 只会阻塞 G，而不会导致 M 被阻塞，避免了创建大量的 M 。
  
  > sysmon 会定期进行 epoll_wait，如果文件描述符就绪，就会重新调度 goroutine

work stealing 调度算法（为了使得调度更加公平和充分）：

- 如果 P 的本地运行队列里已经没有 G 了，会从全局运行队列里获取 G 来执行。如果全局运行队列中也没有 G，这时候 P 就会从其他的 P 那边获取一半的 G 来执行，确保每个OS线程都能充分利用。

## G-M 模型和 G-P-M 模型的区别

Go1.0 的 G-M 模型限制了Go并发程序的伸缩性，尤其是对那些有高吞吐或并行计算需求的服务程序。

主要体现在如下几个方面：

- 单一全局互斥锁(Sched.Lock)和集中状态存储的存在导致所有goroutine相关操作，比如：创建、重新调度等都要上锁；
- goroutine传递问题：M经常在M之间传递”可运行”的goroutine，这导致调度延迟增大以及额外的性能损耗；
- 每个M做内存缓存，导致内存占用过高，数据局部性较差；
- 由于syscall调用而形成的剧烈的worker thread阻塞和解除阻塞，导致额外的性能损耗。

在Go 1.1中实现了G-P-M调度模型和work stealing算法，P 的作用：

- 每个 P 都有一个队列，用来存正在执行的 G，将锁移动到 P 中避免了 Global Sched Lock。
- 当 G 进行系统调用而阻塞时，P 可以带着 G 的队列直接转移到其他 M 上。
- 把 cache 从 M 移到 P，因为每个运行的 M 都有关联的 P，所以只有运行的 M 才有自己的 MCache（用于存放小对象）

## OS 本身可以调度线程，为何还需要在用户空间实现一个调度器？

1. 线程粒度太粗，会有很多额外开销，而 goroutine 不需要这些开销，它们需要更细粒度的控制。

2. 可以让runtime自己决定调度的时机。因为 OS 无法根据 Go 模型做出明智的调度决策。例如，Go 在运行 GC 时需要保证： 
   
   - 所有线程都停止
   
   - 内存处于一致状态
     
     可以想象到，如果有许多threads在某种程度上“随机”的时间点被进行调度，就会经常需要去等待这些threads,等它们达到一个consistent state。如果是golang 自身实现的调度器，它可以在所有threads达到memory consistency的状态的时候才决定进行调度，因此在调度时机的选取上，这样更为高效。即是说，当我们准备进行 GC 的时候，只需要等待那些正在被运行的进程停下来就可以了。

## Goroutine 和线程的区别?

从调度上看，goroutine的调度开销远远小于线程调度开销。

- OS的线程由OS内核调度，每隔几毫秒，一个硬件时钟中断发到CPU，CPU调用一个调度器内核函数。这个函数暂停当前正在运行的线程，把他的寄存器信息保存到内存中，查看线程列表并决定接下来运行哪一个线程，再从内存中恢复线程的注册表信息，最后继续执行选中的线程。这种线程切换需要一个完整的上下文切换：即保存一个线程的状态到内存，再恢复另外一个线程的状态，最后更新调度器的数据结构。某种意义上，这种操作还是很慢的。
- Go运行的时候包涵一个自己的调度器，这个调度器使用一个称为一个M:N调度技术，m个goroutine到n个os线程（可以用GOMAXPROCS来控制n的数量），Go的调度器不是由硬件时钟来定期触发的，而是由特定的go语言结构来触发的，他不需要切换到内核语境，所以调度一个goroutine比调度一个线程的成本低很多。

从栈空间上，goroutine的栈空间更加动态灵活。

- 每个OS的线程都有一个固定大小的栈内存，通常是2MB，栈内存用于保存在其他函数调用期间哪些正在执行或者临时暂停的函数的局部变量。这个固定的栈大小，如果对于goroutine来说，可能是一种巨大的浪费。作为对比goroutine在生命周期开始只有一个很小的栈，典型情况是2KB, 在go程序中，一次创建十万左右的goroutine也不罕见（2KB*100,000=200MB）。而且goroutine的栈不是固定大小，它可以按需增大和缩小，最大限制可以到1GB。
- 为了使栈很小，Go的运行时使用了分段式栈。一个新创建的Go程给定几KB，这几乎总是足够的。 当它不够时，运行时会自动地分配（并释放）扩展片段。每个函数调用平均需要大概三条廉价的指令。 这实际上是在相同的地址空间中创建了成百上千的Go程。如果Go程是线程的话，系统资源会更快地耗尽。

## 怎么查看Goroutine的数量?

线上的话用：runtime.NumGoroutine()

调试时候用：

```go
import _ "net/http/pprof"
```

## goroutine 泄漏怎么处理？

使用 context 设置超时

## 怎么实现 goroutine 完美退出？

使用 sync.WaitGroup

## 主 goroutine 如何等其余 goroutine 结束后再操作

使用 sync.WaitGroup

```
func main() {
    var wg sync.WaitGroup
    wg.Add(1)

    go func() {
        fmt.Println("goroutine: done")
        wg.Done()
    }()

    wg.Wait()
    fmt.Println("main: done")
}
```

## Goroutine 调度用了什么系统调用

- 创建内核线程
- 用户程序执行的系统调用
- epoll，epoll_wait

## 什么情况会阻塞并创建新的调度线程

- 本地IO调用
- 基于底层系统同步调用的Syscall
- CGo方式调用C语言动态库中的调用IO或其它阻塞
- 网络IO可以基于epoll的异步机制（或kqueue等异步机制），但对于一些系统函数并没有提供异步机制。例如常见的posix api中，对文件的操作就是同步操作。虽有开源的fileepoll来模拟异步文件操作。但Go的Syscall还是依赖底层的操作系统的API。系统API没有异步，Go也做不了异步化处理。

## 列出可以停止或暂停当前goroutine执行的函数

- runtime.Gosched: 使当前 goroutine 放弃 CPU，设置为 runnable，放入全局运行队列中。
- runtime.gopark: 阻塞，直到参数列表中的回调函数unlockf返回false。
- runtime.notesleep: 休眠线程
- runtime.Goexit: 立即停止执行 goroutine 并延迟调用。

## Questions

下面这段代码为什么会卡死？

```go
func main() {
    var i byte
    go func() {
        for i = 0; i <= 255; i++ {
        }
    }()
    fmt.Println("Dropping mic")
    // Yield execution to force executing other goroutines
    runtime.Gosched()
    runtime.GC()
    fmt.Println("Done")
}
```

解析：

Golang 中，byte 其实是 uint8 的别名。所以上面的 for 循环会始终成立，因为 i++ 到 i=255 的时候会溢出，i <= 255 一定成立。也就是说 for 循环永远无法退出。

正在被执行的 goroutine 发生以下情况时让出当前 goroutine 的执行权，并调度后面的 goroutine 执行：

- IO 操作
- Channel 阻塞
- system call
- 运行较长时间

如果一个 goroutine 执行时间太长，scheduler 会在其 G 对象上打上一个标志（ preempt），当这个 goroutine 内部发生函数调用的时候，会先主动检查这个标志，如果为 true 则会让出执行权。

main 函数里启动的 goroutine 其实是一个没有 IO 阻塞、没有 Channel 阻塞、没有 system call、没有函数调用的死循环。也就是，它无法主动让出自己的执行权，即使已经执行很长时间，scheduler 已经标志了 preempt。

而 golang 的 GC 动作是需要所有正在运行 goroutine 都停止后进行的。因此，程序会卡在 runtime.GC() 等待所有协程退出。

---

实现两个 goroutine 打印 A1B2C3...Z26

```go
func main() {
    ch := make(chan struct{})

    go func() {
        for i := 'A'; i <= 'Z'; i++ {
            fmt.Printf("%c", i)
            ch <- struct{}{}
            <-ch
        }
    }()

    go func() {
        for i := 1; i <= 26; i++ {
            <-ch
            fmt.Printf("%v", i)
            ch <- struct{}{}
        }
    }()

    time.Sleep(1 * time.Second)
}

// 或者
func main() {
    runtime.GOMAXPROCS(1)

    go func() {
        for i := 'A'; i <= 'Z'; i++ {
            fmt.Printf("%c", i)
            runtime.Gosched() //1

        }
    }()

    go func() {
        for i := 1; i <= 26; i++ {
            fmt.Printf("%v", i)
            runtime.Gosched() //1

        }
    }()

    time.Sleep(1 * time.Second)
}
```

---

编译并运行如下代码会发生什么？

```go
var wg = &sync.WaitGroup{}

func main() {
    for i := 0; i < 10; i++ {
        go func(i int) {
            wg.Add(1)
            println(i)
            defer wg.Done()
        }(i)
    }
    wg.Wait()
}
```

答：可能无法输出全部的 0 到 9。

解析：可能出现 wg.Add(1) 还没有执行 main 函数就执行完毕了。

# Channel

## channel 的实现

channel 的底层数据结构 src/runtime/chan.go：

```go
type hchan struct {
    qcount   uint           // 当前队列中元素个数
    dataqsiz uint           // 环形队列长度，即 channel 的缓冲区大小
    buf      unsafe.Pointer // 环形队列指针
    elemsize uint16         // 每个元素的大小
    closed   uint32            // 标识关闭状态
    elemtype *_type         // 元素类型
    sendx    uint           // 队列下标，元素写入位置
    recvx    uint           // 队列下标，元素读出位置
    recvq    waitq          // 等待读消息的goroutine队列
    sendq    waitq          // 等待写消息的goroutine队列
    lock mutex              // 互斥锁，chan不允许并发读写
}

type waitq struct {
    first *sudog
    last  *sudog
}
```

参考：[Go 原理解析：channel是如何工作的](http://www.10tiao.com/html/528/201708/2653370181/1.html)

channel 使用 queue + lock 实现：

- buf 是环形队列指针，sendx 和 recvx 表示队列的下标，控制队列的读写
- lock 锁，用于入队出队时锁住 channel
- sendq 和 recvq 是两个等待队列，sendq 存放因写操作阻塞在 channel 上的 goroutine，recvq 存放因读操作阻塞在 channel 上 goroutine，实际是 g 结构的链表（用链表实现的队列）。

发送数据给 channel：

1. 如果等待接收队列 recvq 不为空，说明缓冲区为空或者没有缓冲区，此时从 recvq 取出 G，并把数据写入该 G 的 sudog 结构，然后把该 G 唤醒，结束发送过程；
2. 如果 channel 缓冲区中有空余位置，将数据写入缓冲区，结束发送过程；
3. 将待发送数据和 G 存入 sendq，进入睡眠，等待被读 goroutine 唤醒；

从 channel 接收数据：

1. 如果等待发送队列sendq不为空，说明缓冲区已满或没有缓冲区，此时从 sendq 中取出 G 并读出数据，结束接收过程。
2. 如果 channel 缓冲区中有数据，则从缓冲区取出数据，结束接收过程；
3. 将当前 goroutine 加入 recvq，进入睡眠，等待被写 goroutine 唤醒；

使用 `ch := make(chan Task, 3)` 创建一个有缓存的队列，会得到一个slot为3的空队列，sendx和recvx都为0。

![image](http://note.youdao.com/yws/res/137308/9696DB4F9F7B4B849CCE41D4F732522A)

当放入一个task后，sendx为1并且slot 0被占用。

![image](http://note.youdao.com/yws/res/137306/062B7974FF0448C4B36F73770288AC0C)

如果继续放入两个task,这时候sendx为0，并且所有的slots都有数据。

![image](http://note.youdao.com/yws/res/137312/B7F1D681CAC74926BB8E05EF2C3FF0C7)

当读取一个task之后slot 0的数据清空，recvx设置为1。

![image](http://note.youdao.com/yws/res/137316/183FCB38A6434D3FB84B045F97B776AB)

## 有缓冲和无缓冲的区别

无缓冲的 channel：

- 在 channel 上发送或接收时会阻塞，直到其他 goroutine 进行接收或发送。

有缓冲的 channel：

- 带缓存的 channel 持有一个队列，如果队列满，发送操作将阻塞。如果队列空，接收操作会阻塞。

区别：

- 无缓冲的 channel 保证发送和接收时同步的，有缓冲的 channel 则没有这种保证。
- 有缓冲的 channel 可以减少排队阻塞，效率更高。

## 关闭 channel

- 对关闭的 channel 执行任何 发送操作 都将导致panic异常
- 对关闭的 channel 执行 接收操作 依然可以接受到之前已经成功发送的数据，没数据的话立即返回零值;

## 退出程序时怎么防止channel没有消费完

退出程序时，及时关闭 channel。

当发送者关闭 channel 的时候：

- `v := <-ch` 会立即返回 channel 的零值
- `v, ok := <-ch` 的 ok 参数会返回 false
- `for v := range ch` 会退出循环

## 如何获取 channel 的缓存大小和缓存的个数

```go
ch := make(chan int, 2)
ch <- 1

fmt.Println(cap(ch), len(ch))   // cap:2 len:1
```

## channel 缓存的长度怎么确定？

主要还是根据消费者消费的速度来看。

- 如果下游消费速度快，缓存长度就可以设小的
- 如果下游消费速度慢，缓存长度就可以设大点

## 怎么解决生产者生产速度过快？

如果 channel 的缓存设置大一点的话，避免生产者排队阻塞，类似于消息队列。

也可以增加消费者或加速消费者

## channel 发生死锁怎么办

发生死锁的情况：

- 向无缓冲 channel 发送数据但无人接收，或接收数据但无人发送，造成死锁

死锁解决：

- 使用有缓存的 channel

## select 的用法

- 同时处理多个 channel，select 会随机选择一个可用的 channel 做收发操作，或执行 default case。
- 在 select 中设置超时：`case <-time.After(time.Second * 3)`，time.After函数会立即返回一个channel，并起一个新的goroutine 在经过特定的时间后向该channel发送一个独立的值。

## Questions

下面代码有什么问题？

```go
func Stop(stop <-chan bool) {
    close(stop)
}
```

答：只接受的 channel 是不能关闭的；只发送的 channel 可以关闭。

---

写代码实现两个 goroutine，其中一个产生随机数并写入到 go channel 中，另外一个从 channel 中读取数字并打印到标准输出。最终输出五个随机数。

```go
func main() {
    out := make(chan int)
    wg := sync.WaitGroup{}
    wg.Add(2)
    go func() {
        defer wg.Done()
        for i := 0; i < 5; i++ {
            out <- rand.Intn(5)
        }
        close(out)
    }()
    go func() {
        defer wg.Done()
        for i := range out {
            fmt.Println(i)
        }
    }()
    wg.Wait()
}
```

# Lock

## mutex 用到的 CPU 指令

- CAS操作：LOCK（锁总线）、CMPXCHG（比较和交换） 

- 原子操作：LOCK 和其他算术操作，如 XADD、ORB 等

- 自旋操作：PAUSE 指令，PAUSE 会延迟流水线执行指令，也就是说CPU什么都不会做，只会消耗CPU时间。

## mutex 的实现

mutex 的定义：

```go
type Mutex struct {
    state int32     // 锁的状态
    sema  uint32    // 信号量，用于向处于 Gwaitting 的 G 发送信号
}
```

包变量 mutexLocked 表示锁是否可用：0可用，1被别的goroutine占用

```go
func (m *Mutex) Lock() {
    // Fast path: grab unlocked mutex.
    if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
        if race.Enabled {
            race.Acquire(unsafe.Pointer(m))
        }
        return
    }
    // Slow path (outlined so that the fast path can be inlined)
    m.lockSlow()
}
```

加锁操作：

- 先调用 CAS 尝试获取锁，CAS 判断如果锁的状态为0，将其设置为1；如果 CAS 成功，意味着加锁成功，直接返回
- 如果 CAS 失败，表示锁已经被占，进入for循环，期间可能会自旋，也可能会休眠。

为了保证出现 mutex 竞争情况时的公平性，mutex 有两种模式：正常模式，饥饿模式

- 在正常状态下，所有等待锁的 G 按照 FIFO 顺序等待。
  
    当 G 被信号量唤醒后，不会直接拥有锁，而是会和新请求锁的 G 竞争。由于新请求锁的 G 因为正在CPU上执行，而且可能有好几个，所以刚唤醒的 G 很大可能在锁竞争中失败。在这种情况下，这个被唤醒的 G 会加入到等待队列的前面。 
  
    然后如果一个等待的 G 超过1ms没有获取锁，那么它将会把锁转变为饥饿模式。

- 在饥饿模式下，锁被 unlock 后，锁的所有权会直接交给等待队列中的第一个 G。新来的 G 将不会尝试去获得锁，即使锁看起来是unlock状态, 也不会去尝试自旋操作，而是放在等待队列的尾部。
  
    当一个等待的 G 获取了锁，如果它是队列中的最后一个，或者它等待的时候小于1ms，它会将锁的状态转换为正常模式。

正常模式有更好地性能，一个 goroutine 可以连续获得好几次 mutex，即使有阻塞的等待者。而饥饿模式可以有效防止出现位于等待队列尾部的等待者一直无法获取到 mutex 的情况。

参考：

- https://colobu.com/2018/12/18/dive-into-sync-mutex/
- https://www.jianshu.com/p/b839a6c8c3c4

## rwmutex 的实现

golang 的读写锁是使用一个互斥锁加数个控制变量实现的：

- 读锁：单独使用原子操作实现，还有等待队列
  
  - RLock：原子增加读操作计数，即 readerCount+1，阻塞等待写操作结束(如果有的话)
  - RUnlock：原子减少读操作计数，即 readerCount-1，唤醒等待写操作的协程（如果有的话）

- 写锁：使用互斥锁，还有等待队列
  
  - Lock：获取 mutex 互斥锁，如果此时还有读者的话，会进入等待队列。当读者调用 RUnlock 时判断如果读者为0，就会唤醒该写者。
  - Unlock：唤醒因 RLock 而阻塞的 goroutine，释放 mutex 互斥锁。

```go
type RWMutex struct {
    w           Mutex  // held if there are pending writers
    writerSem   uint32 // semaphore for writers to wait for completing readers
    readerSem   uint32 // semaphore for readers to wait for completing writers
    readerCount int32  // number of pending readers
    readerWait  int32  // number of departing readers
}
```

读写锁是使用一个互斥锁加数个控制变量实现的。

- 读锁
  
    加锁：将 readerCount 原子增1，如果已经加了写锁，将放入等待队列
  
    解锁：

- 写锁，则是在互斥锁外边又包了一层逻辑来记录当前锁的状态。经过前面互斥锁的解读，相信这里不需要做过多解释也就基本理解了。

## Go 里怎么保证线程安全

- channel
- 原子操作
- mutex 互斥锁 / rwmutex 读写锁

## rwmutex 和 mutex 的区别

- mutex 是互斥锁，同一时刻只能有一个人持锁
- rwmutex 是读写锁，允许多个读操作并行，但写操作完全互斥。

## G1 通过 Lock 获取了锁，G2 调用 Unlock 释放了锁，会发生什么？

G2 调用 Unlock 成功，但是如果将来 G1调用 Unlock 会 panic

## channel 还是 mutex ？

主要还是看场景。

channel 适合数据流动的场景，比如多个 goroutine 之间需要通信：

- 传递数据的所有权，即把某个数据发送给其他协程
- 分发任务，每个任务都是一个数据
- 发送异步结果，结果是一个数据

mutext 适合数据位置固定的场景，比如保护缓存、状态等共享变量。

## go run -race 怎么实现的

golang在1.1之后引入了竞争检测机制，可以使用 go run -race 或者 go build -race 来进行静态检测。 

内部实现: 开启多个 goroutine 执行同一个命令， 并且记录下每个变量的状态.

## 题目

下面的代码有什么问题?

```go
type UserAges struct {
    ages map[string]int
    sync.Mutex
}

func (ua *UserAges) Add(name string, age int) {
    ua.Lock()
    defer ua.Unlock()
    ua.ages[name] = age
}

func (ua *UserAges) Get(name string) int {
    if age, ok := ua.ages[name]; ok {
        return age
    }
    return -1
}
```

答： 在执行 Get方法时可能被panic

虽然有使用sync.Mutex做写锁，但是map是并发读写不安全的。map属于引用类型，并发读写时多个 goroutine 见是通过指针访问同一个地址，即访问共享变量，此时同时读写资源存在竞争关系。会报错误信息:“fatal error: concurrent map read and map write”。

可以使用 sync.RWMutex 读写锁，基于互斥锁的实现，可以加多个读锁或者一个写锁。

```go
type UserAges struct {
    ages map[string]int
    sync.RWMutex
}

func (ua *UserAges) Add(name string, age int) {
    ua.Lock()
    defer ua.Unlock()
    ua.ages[name] = age
}

func (ua *UserAges) Get(name string) int {
    ua.RLock()
    defer ua.RUnlock()
    if age, ok := ua.ages[name]; ok {
        return age
    }

    return -1
}
```

# Memory

## Go 运行时分配内存的策略

- 对于大对象（> 32KB），直接从堆上分配。

- 对于小对象（<= 32KB），首先从 P 的缓存 mcache 获取（不需要加锁），然后从全局缓存 mcentral 获取（需要加锁），最后是从堆中获取。 
  
  - 先从goroutine私有的内存池中分配内存，不需要上锁。
  
  - 否则从中心内存池申请内存，中心内存池是共享数据，此时需要上锁
  
  - 否则从堆里申请内存。
    
    私有内存池和中心内存池里的内存都是按照大小分开管理的，这样，分配和释放内存都非常快，而且也不容易产生碎片。通常，中心内存池从堆上申请一大块内存，然后将其打碎成多个同样大小的块，并串成一个free list。而当私有内存池向中心内存池申请内存时，也会一次性多要一些内存块，供以后使用，避免私有内存池和中心内存池之间过于频繁地交互，增加上锁的代价。
    
    而当私有内存池内有过多的剩余内存时，会将其中一部分还给中心内存池，供其它go routine使用，以此避免其它goroutine在有内存的时却申请不到内存的情况。

## 变量的分配位置，堆 vs 栈，内存逃逸

在 Go 中，如果值的寿命超出了函数调用的寿命，则编译器会自动将其移动到堆中。 说明该值“逃逸”到堆。

这算是一种优化。在 Go 中意外返回栈分配变量的地址是不可能的。

下面的例子中，在 NewFoo 中分配的 Foo 将被移到堆中，因此在 NewFoo 返回后其内容仍然有效。

```go
type Foo struct {
    a, b, c, d int
}

func NewFoo() *Foo {
    return &Foo{a: 3, b: 1, c: 4, d: 7}
}
```

Go 里的逃逸分析是什么:

- 逃逸分析就是确定变量的作用域范围，然后决定变量是分配在堆上还是栈上

Go 是通过在编译器里做逃逸分析来决定一个对象放栈上还是放堆上：

- 不逃逸的对象放栈上

- 可能逃逸的放堆上
  
  ```go
    func foo() *int {
        var a int
        return &a   // a 发生了逃逸，会分配在堆上
    }
  ```

> Go语言里没有一个关键字或者函数可以直接让变量被编译器分配到堆上

在堆上分配对象的情况:

- 大于 32KB 的对象
- 函数返回对象指针 / 传递对象指针到其他函数 / 在闭包中使用了对象并且需要修改对象

逃逸分析的好处：

- 确保对象尽量在栈上分配，减少GC压力
- 提高内存分配速度，栈上分配内存比堆上快

怎么避免内存逃逸到堆上？

- 传递对象本身，而不是指针；

怎么分析内存逃逸：

- go build -gcflags '-m'

## GC 原理

### 常用的GC方案

- 引用计数：对每个对象维护一个引用计数，当引用该对象的对象被销毁时，引用计数减1，当引用计数器为0是回收该对象。
  
  - 优点：对象可以很快的被回收，不会出现内存耗尽或达到某个阀值时才回收。
  - 缺点：不能很好的处理循环引用，而且实时维护引用计数，也有一定的代价。
  - 代表语言：Python、PHP、Swift

- 标记-清除：从根变量开始遍历所有引用的对象，引用的对象标记为"被引用"，没有被标记的进行回收。
  
  - 优点：解决了引用计数的缺点。
  - 缺点：需要STW，即要暂时停掉程序运行。
  - 代表语言：Golang(其采用三色标记法)

- 分代收集：按照对象生命周期长短划分不同的代空间，生命周期长的放入老年代，而短的放入新生代，不同代有不能的回收算法和回收频率。
  
  - 优点：回收性能好
  - 缺点：算法复杂
  - 代表语言： JAVA

### Go GC 触发时机

- **阈值触发**：在申请内存时，如果当前已分配内存大于上次GC后的内存的2倍，则触发GC，比如初始阈值是10MB，则下一次就是20MB，再下一次就是40MB...
- **两分钟定时触发**：监控线程发现上次GC的时间已经超过两分钟了，则触发GC
- **手动触发**：调用 runtime.GC()。

![image](http://note.youdao.com/yws/res/141991/051C7B98BE9443058C443849C3386CF7)

Golang 1.5后，采取的是“非分代的、非移动的、并发的、三色的”标记清除垃圾回收算法。

三色标记法：

- 所有对象最开始都是白色。
- 从 root 开始找到所有可达对象，标记为灰色，放入待处理队列。
- 遍历灰色对象队列，将其引用对象标记为灰色放入待处理队列，自身标记为黑色。
- 处理完灰色对象队列，执行清扫工作（清理白色）。

gc的过程一共分为四个阶段：

- 栈扫描（开始时STW）
  
    先STW，做一些准备工作，比如 enable write barrier。然后取消STW，将扫描任务作为多个并发的goroutine立即入队给调度器，进而被CPU处理

- 第一次标记（并发）
  
    第一轮先扫描root对象，包括全局指针和 goroutine 栈上的指针，标记为灰色放入队列

- 第二次标记（STW）
  
    第二轮将第一步队列中的对象引用的对象置为灰色加入队列，一个对象引用的所有对象都置灰并加入队列后，这个对象才能置为黑色并从队列之中取出。循环往复，最后队列为空时，整个图剩下的白色内存空间即不可到达的对象，即没有被引用的对象；

- 清除（并发）
  
    第三轮再次STW，将第二轮过程中新增对象申请的内存进行标记（灰色），这里使用了write barrier（写屏障）去记录

mark 有两个过程。第一是从 root 开始遍历，标记为灰色。遍历灰色队列。第二re-scan 全局指针和栈。因为 mark 和用户程序是并行的，所以在过程 1 的时候可能会有新的对象分配，这个时候就需要通过写屏障（write barrier）记录下来。re-scan 再完成检查一下。

- 写屏障可以理解为编译器在写操作时特意插入的一段代码，因为对于和用户程序并发运行的垃圾回收算法，用户程序会一直修改内存，所以需要记录下来。

Golang gc 优化的核心就是尽量使得 STW(Stop The World) 的时间越来越短。

## 为什么小对象多了会造成gc压力。

小对象过多会引起服务吞吐问题，

小对象过多会导致GC三色法标记时消耗过多的CPU。

优化思路是，减少对象分配。

![image](http://note.youdao.com/yws/res/155617/A60E35DC452C4C8A8A3D4053C6F25C60)

虽然浪费了一些内存资源，但是能减少GC的开销。

## sync.Pool 的作用

对象池，避免频繁分配对象，降低GC的压力。

注意点：

- Pool无法设置大小
- Pool中的对象每次GC发生时都会被清理掉。

## Go 什么情况下会发生内存泄漏？

- goroutine 永远处于阻塞状态，就发生泄露
- ctx 没有 cancel 的时候，也会发生泄露

# Packages

## reflect 的作用

Reflect 能够在运行时更新变量和检查它们的值、调用它们的方法和它们支持的内在操作，而不需要在编译时就知道这些变量的具体类型。

题目：

下面这段代码输出的值为：

```go
func main() {
    jsonStr := []byte(`{"age":1}`)
    var value map[string]interface{}
    json.Unmarshal(jsonStr, &value)
    age := value["age"]
    fmt.Println(reflect.TypeOf(age))    // 输出 float64
}
```

## Context 包的用途

context 用来在多个 goroutine 之间传递上下文，goroutine 可以监听 `ctx.Done` 返回的接收 channel，然后做一些操作。

`ctx.Done` 返回的 channel 在下面几种情况下会被关闭：

- `context.WithCancel` 返回的 cancel 函数被调用的时候
- `context.WithTimeout` 设置的超时时间到达
- `context.WithDeadline` 设置的截止时间到达，或者返回的 cancel 函数被调用

## html/template 和 text/template 的区别

html/template 和 text/template 具有相同的API，但是 html/template 还具有针对攻击的安全功能，比如代码注入等。

## time.Now() 返回的是什么时间？这样做的决定因素是什么?

time.Now() 返回本地时间。

## vendor 目录的作用

Go1.6引入了 vendor 目录，该目录下的包只能被它的父目录下的代码导入，并且可以省略前缀。

## 在 Vendor 特性之前包管理工具是怎么实现的？

设置多个 GOPATH，如：export GOPATH=~/gopath1:~/gopath2:~/gopath3，一个项目一个 GOPATH。

# Command

## $GOROOT vs $GOPATH

$GOROOT 是 Go 的安装位置，也是标准库的所在位置。

$GOPATH 是 Go 的工作空间，由 bin、pkg、src 组成。

- src 目录包含 Go 源代码
- pkg 目录包含包对象，即编译后生产的文件
- bin 目录包含可执行文件

## 如何使用 pprof 监控服务性能

Add `import _ "net/http/pprof"` in the main.go

Run the following commands to get info correspondingly:

CPU profile:

    go tool pprof http://localhost:6060/debug/pprof/profile --second N

heap profile:

    go tool pprof http://localhost:6060/debug/pprof/heap

goroutine blocking profile:

    go tool pprof http://localhost:6060/debug/pprof/block

topN 命令可以查出程序最耗 CPU 的调用。

# 其他

下面函数有什么问题？

```go
func funcMui(x,y int)(sum int,error){
    return x+y,nil
}
```

函数返回值命名，只要有一个返回值被命名，其他的也必须有命名。 

## 实现 Set

```go
type IntSet struct {
    m map[int]bool
    sync.RWMutex
}

func (s IntSet) Add(n int) {
    s.Lock()
    defer s.Unlock()
    s.m[n] = true
}

func (s IntSet) Exist(n int) bool {
    s.RLock()
    defer s.RUnlock()
    return s.m[n]
}
```

## 实现 goroutine 池

怎么限制Goroutine同时运行的数量?

在Golang中，Goroutine虽然很好，但是数量太多了，往往会带来很多麻烦，比如耗尽系统资源导致程序崩溃，或者CPU使用率过高导致系统忙不过来。所以我们可以限制下Goroutine的数量,这样就需要在每一次执行go之前判断goroutine的数量，如果数量超了，就要阻塞go的执行。

第一时间想到的就是使用 channel 。每次执行的go之前向 channel 写入值，直到 channel 满的时候就阻塞了。

参考：[怎么限制Goroutine的数量](https://github.com/KeKe-Li/golang-interview-questions/blob/master/src/chapter05/golang.01.md)

## Go 定时器实现

数组实现的四叉小顶堆结构

![image](http://note.youdao.com/yws/res/146526/E075EECCF73840D8B2ADCBFF329491E2)

## 其他

问了cas的缺点，什么样的情况下应该用mutex。我说抢类似那种类似文件资源可以用。但是生产消费者模型肯定不能用，无论是mpsc还是spmc或者mpmc都不能用。mutex陷入内核影响效率只是一方面的原因，更重要的是抢到mutex的线程一旦被调度，整个进程全部卡死。讲了可以用队列，好处是可以原子操作，这样整个程序都是wait free的。
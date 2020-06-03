defer关键字，可以注册多个延迟调用，以先进先出(FIFO)的顺序在函数返回前被执行。

defer常用于保证一些资源最终一定能够得到回收和释放，否则会引起内存泄漏等问题。

为什么用FIFO呢？因为资源之间可能存在一定的依赖关系，采用FIFO可以安全的退出并回收资源。

defer后面必须是函数或方法的调用，不能是语句。

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

/*
输出：
打印后
打印中
打印前
panic: 触发异常
*/
```

defer函数的实参在注册时通过值拷贝传递进去。
```go
package main

import "fmt"

func main() {
	a := 0
	defer func(i int) {
		println("defer a: ", i)
	}(a)

	a++
	fmt.Println("main a: ", a)
}
/*
输出：
main a:  1
defer a:  0

*/
```
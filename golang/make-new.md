# make与new的区别

在go中，make和new都是用来分配内存的，但其本质不同



- make只能用来初始化内建类型: slice, hash table, channel

- new根据指定的类型来分配内存，然后返回此类型的指针



![](https://miro.medium.com/max/1400/1*AmLvcq1keckyKB8uJxSlIA.png)



## make



不经过make函数初始化的slice，其零值为nil，初始化后为[]int{0}

不经过make函数初始化的map，其零值为nil，初始化后为map[int]string{}

不经过make函数初始化的channel，其零值为nil，初始化后为指针

```go
package main

import (
	"fmt"
)

func main() {
	slice := make([]int, 0, 10)
	hash := make(map[int]int, 10)
	ch := make(chan int, 10)

	fmt.Println(slice, hash, ch)

	var s1 []int
	if s1 == nil {
		fmt.Printf("s1 is nil --> %#v \n ", s1) // []int(nil)
	}

	s2 := make([]int, 10)
	if s2 == nil {
		fmt.Printf("s2 is nil --> %#v \n ", s2)
	} else {
		fmt.Printf("s2 is not nill --> %#v \n ", s2) // []int{0, 0, 0}
	}

	var m1 map[int]string
	if m1 == nil {
		fmt.Printf("m1 is nil --> %#v \n ", m1) //map[int]string(nil)
	}

	m2 := make(map[int]string)
	if m2 == nil {
		fmt.Printf("m2 is nil --> %#v \n ", m2)
	} else {
		fmt.Printf("m2 is not nill --> %#v \n ", m2) //map[int]string{}
	}

	var c1 chan string
	if c1 == nil {
		fmt.Printf("c1 is nil --> %#v \n ", c1) //(chan string)(nil)
	}

	c2 := make(chan string)
	if c2 == nil {
		fmt.Printf("c2 is nil --> %#v \n ", c2)
	} else {
		fmt.Printf("c2 is not nill --> %#v \n ", c2) //(chan string)(0xc420016120)
	}
}

```



在go编译期，类型检查阶段会把make函数根据不同的类型转为**OMAKESLICE**,**OMAKEMAP**,**OMAKECHAN**



三种node会调用不同的runtime方法来初始化数据结构



![](https://miro.medium.com/max/1400/1*yD_BLddhvrPL8ehpFqbRnA.png)



## new



new(T)函数会为type T分配内存，并初始化为type T的零值，返回执行type T类型的指针*T，实际指向新初始化的T值



```go
package main

import (
	"fmt"
)

func main() {
	p1 := new(int)
	fmt.Printf("p1 --> %#v \n ", p1)           //(*int)(0xc42000e250)
	fmt.Printf("p1 point to --> %#v \n ", *p1) //0
	var p2 *int
	i := 0
	p2 = &i
	fmt.Printf("p2 --> %#v \n ", p2)           //(*int)(0xc42000e278)
	fmt.Printf("p2 point to --> %#v \n ", *p2) //0
}

```



在实际的编码中，内建方法new并不常用，通常会使用短表达式声明来替代

```go
i := 0
u := object{}
```



## 区别

1. make和new都是在堆上分配内存，但**make**只能用于切片，map，channel的初始化（非零值），new可用于任何类型，并且初始化为其零值

2. make返回的三种类型本身，new返回的是指向其类型的指针

3. **make**方法是不可替代的，用它来初始化slice,map,channel，之后操作它们



## 参考资料：

https://levelup.gitconnected.com/go-make-or-new-bc19f5a57bf9

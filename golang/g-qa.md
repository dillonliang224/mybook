- channel实现

- 内存分配

- 可变函数

- 别名

- 切片截取第三个参数

- 基于类型创建的方法必须定义在同一个包内

- iota

### 原子操作CAS

原子操作cas在高并发的情况下，单次cas的执行成功率会降低，因此需要配合循环语句for，形成一个for+atmoc的类似自旋乐观锁的操作

原子操作主要由硬件提供支持，锁一般是由操作系统提供支持，比起直接使用锁，使用CAS这个过程不需要形成临界区和创建互斥量，所以会比使用锁更加高效。



## iota



iota是golang语言的常量计数器，只能在常量的表达式中使用



iota在const关键字出现时将被重置为0（const内部的第一行之前），const中每新增一行常量声明将使iota计数一次（iota可理解为const语句块中的行索引）



## 常量

常量组中如不指定类型和初始化值，则与上一行非空常量右值相同

```go
const (
     x uint16 = 120
     y
     s = "abc"
     z
 )
 func main() {
    fmt.Printf("%T %v\n", y, y) // uint16 120
    fmt.Printf("%T %v\n", z, z) // string abc
}
```



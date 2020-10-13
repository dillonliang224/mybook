# Go 指针

Go中的指针有两种，

- 一种是内置类型uintptr，本质是一个整数

> uintptr is an integer type that is large enough to hold the bit pattern of any pointer. 是一个整数类型，它的大小足以容纳任何指针的位模式。

- 另一种是unsafe包提供的Pointer，表示可以指向任意类型的指针

**通常uintptr用来进行指针计算，因为它是整型，所以很容易计算出下一个指针所指向的位置；**

**而unsafe.Pointer用来进行桥接，用于不同类型的指针进行互相转换。**

![type pointer uintptr](https://user-images.githubusercontent.com/7698088/58747453-1dbaee80-849e-11e9-8c75-2459f76792d2.png)

usafe包提供了以下2点重要的能力：

1. 任何类型的指针和unsafe.Pointer可以相互转换

2. uintptr类型和unsafe.Pointer可以相互转换

### 操作Slice

slice的底层结构体如下：

```go
type slice struct {
    array unsafe.Pointer // 元素指针
    len int // 长度
    cap int // 容量
}
```

因为len和cap在slice所占的自己为8，那么我们可以通过unsafe.Pointer和uintptr进行转换，得到slice的字段值

```go
func main() {
    s := make([]int, 5, 9)
    fmt.Println(s)

    Len := *(*int)(unsafe.Pointer(uintptr(unsafe.Pointer(&s)) + uintptr(8)))
    fmt.Println(Len, len(s))
    Cap := *(*int)(unsafe.Pointer(uintptr(unsafe.Pointer(&s)) + uintptr(16)))
    fmt.Println(Cap, cap(s))
}
```

结合上图中的转换规则，Len, Cap的转换过程如下：

```md
Len: &s -> pointer -> uintptr(指针运算) -> pointer -> *int -> int
Cap: &s -> pointer -> uintptr(指针运算) -> pointer -> *int -> int
```

## unsafe包

unsafe包下有三个方法：

- unsafe.Offsetof(x ArbitraryType) uintptr

- unsafe.Sizeof(x ArbitraryType) uintptr

- unsafe.Alignof(x ArbitraryType) uintptr

**Sizeof**返回类型x所占据的字节数，但不包含x所指向的内容的大小。

**Offsetof**返回结构体成员在内存中的位置离结构体起始处的字节数，所传参数必须是结构体的成员。

**Alignof**返回m, m是指当类型进行内存对齐时，它分配到的内存地址能整除m。

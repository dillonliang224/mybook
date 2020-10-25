sync.Once是开箱即用和并发安全的

```go
type Once struct {
    // 标记方法是否执行过，值不是0就是1
    // 为什么设置为uint32类型呢？因为设置done的值是原子操作
    done uint32
    // 锁，为了并发安全
    m    Mutex
}
```

sync.Once只提供了一个方法

```go
func (o *Once) Do(f func())
```

源码很简单

```go

```

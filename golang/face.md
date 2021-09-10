## GPM模型

## GC

## context value 二次赋值

## GRPC meta

链路追踪用到

```go
// 发送
client := pb.NewGreeterClient(conn)
   md := metadata.Pairs("timestamp", time.Now().Format(timestampFormat))
   ctx := metadata.NewOutgoingContext(context.Background(), md)
   resp, err := client.SayHello(ctx, &pb.HelloRequest{Name: "hello, world"})


// 接受
md, ok := metadata.FromIncomingContext(ctx)
   if !ok {
      fmt.Printf("get metadata error")
   }
```

## Goroutine飙升

## 限流/熔断

## 服务注册/服务发现

## Redis淘汰策略

LRU

## Redis底层数据结构

## MySQL索引

## 死锁

## 消息丢失

## 分布式事务

[在 macOS 上使用 Docker Desktop 启动 Kubernetes 踩坑全记录](https://juejin.im/post/6844903950496301063)

[【坑】Docker for MAC 中一直 Kubernetes is starting，不能正确开启](https://juejin.im/post/6844904039709163527)

[HTTPS 温故知新（一） —— 开篇](https://halfrost.com/https-begin/)

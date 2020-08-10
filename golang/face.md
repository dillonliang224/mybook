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

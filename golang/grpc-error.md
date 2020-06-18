优雅地处理golang里grpc错误

## Server

在服务端利用status.Errorf发送错误消息和code

```go
status.Errorf(<grpc error code>, <error message>)
```

demo

```golang
return status.Errorf(codes.InvalidArgument, "BAD_ID")
```

## Client

在客户端，把grpc error转为Status，然后可以获取对应的error message 和 code

```go
_, err := client.GRPCMethod(...)
statusCode := status.FromError(err)
fmt.Println(statusCode.code, statusCode.message)
```

其他语言的grpc错误参考如下链接

> [gRPC Errors](http://avi.im/grpc-errors/)

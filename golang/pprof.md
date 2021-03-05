

```md
heap profile: 2: 262656 [808: 1065536] @ heap/1048576
1: 262144 [1: 262144] @ 0x9239d9 0x924865 0xa190d1 0xbb735c 0xbbc47a 0xbbad16 0xbbee54 0xbb4f0e 0xbb3075 0xbb10a2 0xbc4548 0xe7caf0 0xe7ca55 0xe5c3c9 0xe789a6 0xe5c3c9 0xe6abee 0xe69d28 0xacb86b 0xac4aad 0x4981e1
#	0x9239d8	compress/flate.(*compressor).init+0xdb8				/usr/local/go/src/compress/flate/deflate.go:596
#	0x924864	compress/flate.NewWriter+0xa4					/usr/local/go/src/compress/flate/deflate.go:671
#	0xa190d0	compress/gzip.(*Writer).Write+0x6b0				/usr/local/go/src/compress/gzip/gzip.go:191
#	0xbb735b	runtime/pprof.(*profileBuilder).flush+0xdb			/usr/local/go/src/runtime/pprof/proto.go:148
#	0xbbc479	runtime/pprof.(*profileBuilder).emitLocation+0xcb9		/usr/local/go/src/runtime/pprof/proto.go:570
#	0xbbad15	runtime/pprof.(*profileBuilder).appendLocsForStack+0x655	/usr/local/go/src/runtime/pprof/proto.go:430
#	0xbbee53	runtime/pprof.writeHeapProto+0x333				/usr/local/go/src/runtime/pprof/protomem.go:46
#	0xbb4f0d	runtime/pprof.writeHeapInternal+0x1d8d				/usr/local/go/src/runtime/pprof/pprof.go:576
#	0xbb3074	runtime/pprof.writeHeap+0x54					/usr/local/go/src/runtime/pprof/pprof.go:536
#	0xbb10a1	runtime/pprof.(*Profile).WriteTo+0x521				/usr/local/go/src/runtime/pprof/pprof.go:331
#	0xbc4547	net/http/pprof.handler.ServeHTTP+0x407				/usr/local/go/src/net/http/pprof/pprof.go:256
#	0xe7caef	net/http.HandlerFunc.ServeHTTP+0xcf				/usr/local/go/src/net/http/server.go:2042
#	0xe7ca54	github.com/gin-contrib/pprof.pprofHandler.func1+0x34		/go/pkg/mod/github.com/gin-contrib/pprof@v1.3.0/pprof.go:56
#	0xe5c3c8	github.com/gin-gonic/gin.(*Context).Next+0xa8			/go/pkg/mod/github.com/gin-gonic/gin@v1.6.3/context.go:161
#	0xe789a5	github.com/gin-gonic/gin.RecoveryWithWriter.func1+0x85		/go/pkg/mod/github.com/gin-gonic/gin@v1.6.3/recovery.go:83
#	0xe5c3c8	github.com/gin-gonic/gin.(*Context).Next+0xa8			/go/pkg/mod/github.com/gin-gonic/gin@v1.6.3/context.go:161
#	0xe6abed	github.com/gin-gonic/gin.(*Engine).handleHTTPRequest+0xa6d	/go/pkg/mod/github.com/gin-gonic/gin@v1.6.3/gin.go:409
#	0xe69d27	github.com/gin-gonic/gin.(*Engine).ServeHTTP+0x307		/go/pkg/mod/github.com/gin-gonic/gin@v1.6.3/gin.go:367
#	0xacb86a	net/http.serverHandler.ServeHTTP+0xca				/usr/local/go/src/net/http/server.go:2843
#	0xac4aac	net/http.(*conn).serve+0x84c					/usr/local/go/src/net/http/server.go:1925

# runtime.MemStats
# Alloc = 4186528			## 
# TotalAlloc = 437231544
# Sys = 75318272			## 进程从系统获得的内存空间，虚拟地址空间
# Lookups = 0
# Mallocs = 5672780
# Frees = 5651827
# HeapAlloc = 4186528		## 进程堆内存分配使用的空间，通过是用户new出来的对象，包含未被gc掉的。
# HeapSys = 66355200		## 进程从系统获得的堆内存，因为golang底层使用TCmalloc机制，会缓存一部分堆内存，虚拟地址空间。
# HeapIdle = 59473920
# HeapInuse = 6881280
# HeapReleased = 57638912
# HeapObjects = 20953
# Stack = 753664 / 753664
# MSpan = 94248 / 114688
# MCache = 1736 / 81920
# BuckHashSys = 1502843
# GCSys = 5597768
# OtherSys = 912189
# NextGC = 8133584
# LastGC = 1614051298061740608
# PauseNs = [43358] 		## 记录每次gc暂停的时间(纳秒)，最多记录256个最新记录。
# PauseEnd = [1614048969944789845]
# NumGC = 534				## 记录gc发生的次数
# NumForcedGC = 0
# GCCPUFraction = 1.809977024189395e-06
# DebugGC = false
# MaxRSS = 138223616
```

其中heap profile: 2(inused objects): 262656(inused bytes) [808(alloc objects): 1065536(alloc bytes)] @ heap/1048576


---
分配
2021/02/23 15:32
24: 1125760 [110142: 11929364280]
1: 663552 [15439: 10244579328]

heap profile: 27: 1269120 [110386: 11950571912]
1: 663552 [15463: 10260504576]


堆内存
heap profile: 21: 1066592 [108577: 11929694920] @ heap/1048576
1: 1056768 [2: 2113536] 
1: 458752 [1: 458752]
1: 663552 [15466: 10262495232] 
---


### cpu占用过高
```bash
go tool pprof http://domain.com/debug/pprof/profile
```


### 内存占用过高
```bash
go tool pprof http://domain.com/debug/pprof/heap
```

### 频繁内存回收
```bash
GODEBUG=gctrace=1 ./main 2>&1|grep gc

go tool pprof http://domain.com/debug/pprof/allocs
```

### 协程泄漏
```bash
go tool pprof http://domain.com/debug/pprof/goroutine
```

### 锁的争用
```bash
go tool pprof http://domain.com/debug/pprof/mutex
```


### 阻塞操作
```bash
go tool pprof http://domain.com/debug/pprof/block
```

### 步骤
第一步： go tool pprof http://domain.com/debug/pprof/{填上你想查看的内容}
内容关键字：
allocs	内存分配情况的采样信息
blocks	阻塞操作情况的采样信息
cmdline	显示程序启动命令参数及其参数
goroutine	显示当前所有协程的堆栈信息
heap	堆上的内存分配情况的采样信息
mutex	锁竞争情况的采样信息
profile	cpu占用情况的采样信息，点击会下载文件
threadcreate	系统线程创建情况的采样信息
trace	程序运行跟踪信息


第二步：三连招，top->list FuncName->web
第三步：解决问题


---
1244579328


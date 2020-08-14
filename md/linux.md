## 文件描述符

## 进程间通信

![](http://image.dillonliang.cn/mybook/%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1.png)

## I/O多路复用

### select

数据拷贝开销

数量上限1024

不停的轮询

### poll

同上，但没有数量上限，采用链表

### epoll

无数量上限，采用红黑树+链表

无数据拷贝开销

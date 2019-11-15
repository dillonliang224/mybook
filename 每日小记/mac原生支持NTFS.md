## Mac原生支持NTFS

正常情况下，在win上用的移动硬盘，插到mac上是不支持写操作的，本篇记录如何开启Mac原生支持NTFS。

### 查看Volume Name

1. 首先插入移动硬盘到mac上
2. 打开终端，输入命令：diskutil list查看Volumn Name

![](http://image.dillonliang.cn/blog/mac-ntfs1.jpeg)

记录下这个Volumn Name

### 更新/etc/fstab文件

1. 打开/etc/fstab： sudo vim /etc/fstab
2. 写入 LABEL=DillonLiang none ntfs rw,auto,nobrowse
3. 保存退出

![](http://image.dillonliang.cn/blog/mac-ntfs2.jpeg)

### 使用

1. 拔出硬盘并重新插入
2. 在finder已经看不到硬盘了，在/Volumes
3. 建立软链： sudo ln -s /Volumes ~/Desktop/Volumes
4. 这样在桌面上可以看到这个移动硬盘了，并且支持写操作

![](http://image.dillonliang.cn/blog/mac-ntfs3.jpeg)

### QA

1. 如果Volumn Name有空格，需要用**\040**转义，eg: 如果Volumn Name是Dillon Liang，那么LABEL=Dillon\040Liang
2. LABEL=DillonLiang none ntfs rw,auto,nobrowse，这里面的ntfs rw表示这个分区挂载为可读写的ntfs格式，最后的nobrowse代表不在finder里显示，不打开的话会挂在不成功
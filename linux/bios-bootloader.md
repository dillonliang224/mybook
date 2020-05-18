## 从BIOS到bootloader

x86 作为一个开放的营商环境，有两种模式，一种模式是实模式，只能寻址 1M，每个段最多 64K。这个太小了，相当于咱们创业的个体户模式。有了项目只能老板自己上，本小利微，万事开头难。另一种是保护模式，对于 32 位系统，能够寻址 4G。这就是大买卖了，老板要雇佣很多人接项目。

## 总结

- 实模式只有 1MB 内存寻址空间(X86)
- 加电, 重置 CS 为 0xFFFF , IP 为 0x0000, 对应 BIOS 程序
- 0xF0000-0xFFFFF 映射到 BIOS 程序(存储在ROM中), BIOS 做以下三件事:
    - 检查硬件
    - 提供基本输入(中断)输出(显存映射)服务
    - 加载 MBR 到内存(0x7c00)
- MRB: 启动盘第一个扇区(512B, 由 Grub2 写入 boot.img 镜像)
- boot.img 加载 Grub2 的 core.img 镜像
- core.img 包括 diskroot.img, lzma_decompress.img, kernel.img 以及其他模块
- boot.img 先加载运行 diskroot.img, 再由 diskroot.img 加载 core.img 的其他内容
- diskroot.img 解压运行 lzma_compress.img, 由lzma_compress.img 切换到保护模式

-----------

- 切换到保护模式需要做以下三件事:
    - 启用分段, 辅助进程管理
    - 启动分页, 辅助内存管理
    - 打开其他地址线
- lzma_compress.img 解压运行 grub 内核 kernel.img, kernel.img 做以下四件事:
    - 解析 grub.conf 文件
    - 选择操作系统
    - 例如选择 linux16, 会先读取内核头部数据进行检查, 检查通过后加载完整系统内核
    - 启动系统内核

![x86启动](https://static001.geekbang.org/resource/image/0a/6b/0a29c1d3e1a53b2523d2dcab3a59886b.jpeg)

---
参考:
https://time.geekbang.org/column/article/89739
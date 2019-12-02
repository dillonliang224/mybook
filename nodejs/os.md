# OS

标签（空格分隔）： node.js

---

os(opertion system)操作系统，是node.js里的核心模块，提供了操作系统相关的使用方法。
```js
const os = require('os')
```

目前支持的方法如下：
```js
const os = require('os')

// os.EOL 一个字符串常量，定义操作系统相关的行末标志

// 表明 Node.js 二进制编译所用的 操作系统CPU架构.
let arch = os.arch()
console.log('arch: ', arch)

// 返回一个包含错误码,处理信号等通用的操作系统特定常量的对象
let constants = os.constants
console.log('constants: ', constants)

// 每个逻辑 CPU 内核的信息
let cpus = os.cpus()
console.log('cpus: ', cpus)

// Node.js二进制编译环境的字节顺序, BE大端模式，LE小端模式
let endianness = os.endianness()
console.log('node endianness: ', endianness)

// 空闲系统内存的字节数.
let freemem = os.freemem()
console.log('node freemem: ', freemem)

// 可选参数pid，返回pid对应的调度优先级
let priority = os.getPriority()
console.log('pid priority: ', priority)

// 当前用户的home目录.
let homedir = os.homedir()
console.log('node homedir: ', homedir)

// 操作系统的主机名.
let hostname = os.hostname()
console.log('node hostname: ', hostname)

// 1, 5, 15分钟平均负载
let loadavg = os.loadavg()
console.log('node loadavg: ', loadavg)

// 被赋予网络地址的网络接口
let networkInterfaces = os.networkInterfaces()
console.log('networkInterfaces: ', networkInterfaces)

// Node.js编译时的操作系统平台
let platform = os.platform()
console.log('platform: ', platform)

// 操作系统的发行版.
let release = os.release()
console.log('release: ', release)

// 指定pid进程的调度优先级
// os.setPriority([pid, ] priority)

// 操作系统的默认临时文件目录.
let tmpdir = os.tmpdir()
console.log('tmpdir: ', tmpdir)

// 所有系统内存的字节数.
let totalmem = os.totalmem()
console.log('totalmem: ', totalmem)

// 操作系统的名字
let type = os.type()
console.log('type: ', type)

// 操作系统的上线时间.
let uptime = os.uptime()
console.log('uptime: ', uptime)

// 当前有效用户的信息
let userInfo = os.userInfo()
console.log('userInfo: ', userInfo)

```

### 信号常量

|信号|描述|
|--|--|
|SIGHUP||
# console

标签（空格分隔）： node核心模块

---

> node版本：12.10.0

# Console
console模块提供了一个简单的类似于web浏览器调试控制台的功能。

该模块导出了2个特定组件：

 - Console类，拥有可以写入任何流的方法，比如console.log(),console.error(),console.warn()
 - 一个node环境里的全局对象实例console，输出到标准输出和标准错误，可以直接使用，不需要通过require('console')来引入。

## Console类
console类可以用来创建一个简单的可配置输出流的日志，可以通过如下2中方式引入：
```js
// 1. 引入console包
const { Console } = require('console')

// 2. 通过console结构体
const { Console } = console // or: const Console = console.Console
```
 
### 实例方法

 1. new Console(stdout[, stderr][, ignoreerrors])
 2. new Console(options)

```md
参数options<Object>:
 - stdout <stream.Writable>: 可写流
 - stderr <stream.Writable>: 可写流
 - ignoreErrors <boolean>: 写入底层流时忽略错误，默认为true。
 - colorMode <boolean> | <string>: 设置颜色支持。设置为true，将根据检测的值着色。设置为auto，将使颜色支持取决于isTTY属性的值和getColorDepth（）在相应流上返回的值，默认为auto
 - inspectOptions <Object>: 传递给util.inspect()函数的参数
```

创建Console实例的时候，指定1或2个可写流，stdout是一个可写的流，用于打印日志或信息输出。stderr用于警告或错误输出。如果未提供stderr，则默认为stdout。
```js
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

全局对象console是一个特殊的Console实例，它的输出是发送给系统标准输出和标准错误里，等价于下面代码：
```js
new Console({ stdout: process.stdout, stderr: process.stderr });
```

## console提供的方法

### 日志级别输出

- console.debug(): debug信息，console.log别名
- console.info(): info信息，console.log别名
- console.log(): 日志或信息输出
- console.warn(): warn信息，console.error别名
- console.error(): 错误信息

其中console.log打印到标准输出里，可以传递多个参数
console.error打印到标准错误里，同样可以传递多个参数

### 时间相关的

- console.time([label])
- console.timeLog([label][,...data])
- console.timeEnd([label])

启动可用于计算操作持续时间的计时器。定时器由唯一标签（label）标识。
调用console.timeEnd（）时使用相同的标签来停止计时器并输出经过的时间（以毫秒为单位）到stdout。定时器持续时间精确到亚毫秒。
在此期间，可以通过console.timeLog方法输出过去的时间数和想打印的值。

```js
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```

### 日志分组

- console.group([...label])： 开始
- console.groupCollapsed()： 同上，可折叠日志信息
- console.groupEnd()： 结束

日志分组，会缩紧2个空格

### 其他

- console.dir(obj): 打印目录路径。
- console.dirxml(...data): (TODO)
- console.table(tabularData[,properties]): 打印表格数据，可指定输出列。
- console.count([label]): 计数label
- console.countReset([label]): 重置label次数
- console.clear(): tty相关(TODO)
- console.assert(value[,...message]): 断言式打印输出。
- console.trace([message]): 打印trace信息

TODO：
- console.timeline([label])
- console.timelineEnd([label])
- console.timeStamp([label])
- console.markTimeline([label])
- console.profile([label])
- console.profileEnd([label])
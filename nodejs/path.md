# path

标签（空格分隔）： node.js

---

path模块，提供工具集处理文件和文件夹。引用如下：
```js
const path = require('path')
```

假设我们有一个路径地址address，那么我们能对它做什么呢？

- 获取address所在的文件夹
- 如果address是文件地址，可以获取文件的文件名和扩展名
- 可以对address做地址解析，同样可以解析后的数据做组装，格式化，规范化
- 判断地址是否是绝对地址
- 获取两个路径的相对地址
- 获取系统的定界符和分割符

假设的address: 
```js
let address = '/Users/dillonliang/Desktop/dillon/code/node-study/index.html'
```

## 获取address所在的文件夹
```js
let dir = path.dirname(address)
// dir: /Users/dillonliang/Desktop/dillon/code/node-study
```

## 如果address是文件地址，可以获取文件的文件名和扩展名
```js
let basename = path.basename(address)
// basename: index.html
let extname = path.extname(address)
// extname: .html
```

## 可以对address做地址解析，同样可以解析后的数据做组装，格式化，规范化
```js
let urlObject = path.parse(address)
console.log(urlObject)
```

解析出来的urlObject如下：
```json
{
  root: '/',
  dir: '/Users/dillonliang/Desktop/dillon/code/node-studys',
  base: 'index.html',
  ext: '.html',
  name: 'index'
}
```

换一种写法就是这样的：
```md
┌───────────────────────────────────────────────────────────┬────────────┐
│          dir                                              │    base    │
├──────┬                                                    ├──────┬─────┤
│ root │                                                    │ name │ ext │
"  /    Users/dillonliang/Desktop/dillon/code/node-studys /  index  .html "
└──────┴────────────────────────────────────────────────────┴──────┴─────┘
```

它的逆向工程是：
```js
path.format(urlObject)
```

地址组装：
```js
path.join('/', 'Users/dillonliang/Desktop/dillon/code/node-studys', 'index.html')
```

地址组装，获取绝对地址
```js
path.resolve('code', 'node-studys', 'index.html')
// /Users/dillonliang/Desktop/dillon/code/node-study/code/node-studys/index.html
```

规范化，优化：
```js
path.normalize('/Users/dillonliang/Desktop/dillon/code/node-studys/..')
// /Users/dillonliang/Desktop/dillon/code
```

## 判断地址是否是绝对地址

调用path.isAbsolute(address)

## 获取两个路径的相对地址
```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// ../../impl/bbb
```

## 获取系统的定界符和分割符
```js
let delimiter = path.delimiter
// delimiter: :
let sep = path.sep
// sep: /
```

## 其他

path.posix： 提供posix下的path方法
path.win32： 提供win下的path方法
path.toNamespacedPath(path): win下专用

---
参考：
https://nodejs.org/dist/latest-v12.x/docs/api/path.html#path_path
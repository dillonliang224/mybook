# Deno

## 简介

Deno（蒂诺），因为 Deno 的标志是一只恐龙。恐龙（dinosaur）的英文缩写正是 dino。

官方网站：https://deno.land/

Deno 是 Ryan Dahl 在2017年创立的。

Deno 这个名字就是来自 Node 的字母重新组合（Node = no + de），表示"拆除 Node.js"（de = destroy, no = Node.js）。

Deno是JavaScript/TypeScript运行时，具有安全的默认值和出色的开发人员经验。

它基于V8，Rust和Tokio构建。

## 功能亮点

- 默认为安全。没有文件，网络或环境访问权限（除非明确启用）。
- 开箱即用地支持TypeScript。
- 运送一个可执行文件（deno）。
- 具有内置工具，例如依赖项检查（deno info）和代码格式化（deno fmt）。
- 有经过审核的deno标准模块
- script可以打包编译到一个js文件

## 设计哲学

Deno旨在为现代程序员提供高效且安全的脚本环境。

Deno将始终作为单个可执行文件分发。
给定Deno程序的URL，该文件仅可运行〜15 MB压缩可执行文件，并且可以运行。
Deno明确承担了运行时和程序包管理器的角色。
它使用与浏览器兼容的标准协议来加载模块：URL。

除其他外，Deno很好地替代了以前可能是用bash或python编写的实用程序脚本。

## 目标

- 仅运送一个可执行文件(Deno)
- 提供安全默认值
	- 除非明确允许，否则脚本无法访问File,Network,Environment
- 与浏览器兼容：完全用JavaScript编写且不使用全局Deno名称空间（或对其进行功能测试）的Deno程序的子集，也应该能够在现代Web浏览器中运行而无需更改。
- 提供内置工具，例如单元测试，代码格式化和整理，以改善开发人员的体验。
- 不将V8概念暴露到用户层
- 能够有效地提供HTTP服务

## 与Node.js相比

- Deno不使用npm
	- 它使用URL或文件路径来引用模块
- Deno在其模块解析算法中未使用package.json
- 在Deno中，所有的async操作，均返回promise。因此，Deno提供与Node.js不同的API
- 针对File,Network,Environment,Deno需要显示的指定访问权限
- 未捕获的异常将导致Deno崩溃
- 使用ES module规范，不再支持require()形式。通过URL引用第三方模块：
```js
import * as log from "https://deno.land/std/log/mod.ts";
```

## 其他

- 第一次执行Deno代码的时候，会缓存remote code，不会更新，除非下次执行代码的时候指定了--reload标示
- 从远程URL加载的模块/文件旨在保持不变和可缓存。
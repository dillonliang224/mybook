## Go编码

> Go语言采用的字符编码方案从属于Unicode编码规范。更确切地说，Go语言的代码正是由Unicode字符组成的。Go语言的所有源代码，都必须按照Unicode编码规范中的UTF-8编码格式进行编码。

### ASCII编码

> American Standard Code for Information Interchange
> 
> 美国信息交换标准代码（ASCII）

它是由美国国家标准学会(ANSI)制定的**单字节字符**编码方案，可用于基于文本的数据交换。

ASCII编码方案使用单个字节(byte)的二进制数来编码一个字符，并适用于所有的**拉丁文**字母。

### Unicode编码

Unicode编码规范以ASCII编码集为出发点，并突破了ASCII只能对拉丁文字母进行编码的限制。

Unicode是一个更加通用的、针对书面字符和文本的字符编码标准。

它为世界上现存的所有自然语言中的每一个字符，都设定了一个唯一的二进制编码。

Unicode编码规范提供了三种不同的编码格式，即: UTF-8、UTF-16和UTF-32。UTF是Unicone转换格式，它代表的是字符与字节序列之间的转换方式。“-”右边的整数的含义是，以多少个比特位作为一个编码单元。以UTF-8为例，它会以8个比特，也就是一个字节，作为一个编码单元。

UTF-8是一种可变宽的编码方案。换句话说，它会用一个或多个字节的二进制数来表示某个字符，最多使用四个字节。比如，英文是1个字节，中文是3个字节。

### QA

一个string类型的值在底层是怎样被表达的？

在底层，一个string类型的值是由一系列相对应的Unicode代码点的UTF-8编码值来表达的。

在Go语言中，一个string类型的值既可以被拆分为一个包含多个字符的序列(rune)，也可以被拆分为一个包含多个字节的序列(byte)。

其中一个字符由1-4个字节来代表，也就是int32，所以可用rune来表示一个字符。

![https://static001.geekbang.org/resource/image/0d/85/0d8dac40ccb2972dbceef33d03741085.png](https://static001.geekbang.org/resource/image/0d/85/0d8dac40ccb2972dbceef33d03741085.png)

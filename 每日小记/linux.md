# linux常用命令

## 根据启动脚本删除进程

替换daily-ranking为启动脚本名

```
ps -ef|grep daily-ranking|grep -v grep | cut -c 9-15 | xargs kill -s 9
```

## http性能测试wrk

```bash
git clone https://github.com/wg/wrk.git wrk
cd wrk
make
# 把生成的wrk移到一个PATH目录下面, 比如
sudo cp wrk /usr/local/bin
```

基本压测

```bash
wrk -t12 -c400 -d30s http://127.0.0.1:8080/index.html
```

使用12个线程运行30秒, 400个http并发

更多参考：

[http 性能测试 wrk使用教程 - 掘金](https://juejin.im/post/6844903550288396296)

[GitHub - wg/wrk: Modern HTTP benchmarking tool](https://github.com/wg/wrk)

### 字符串替换

```sh
## 模版
result=$(echo "$firstString" | sed "s/Suzi/$secondString/")

## demo 把字符串'go interface'改为'go-interface'
result=$(echo "$1" | sed "s/ /-/g")
```

# Cluster

标签（空格分隔）： node.js

---

node.js是单线程的，一个node.js实例运行在单个线程里。为了充分利用多核CPU，可以利用Cluser集群技术达到负载均衡。

```js
const cluster = require('cluster')
const http = require('http')
const os = require('os')

const cpuLenght = os.cpus().length

if (cluster.isMaster) {
    console.log(`cluster master run ${process.pid}`)

    for (let index = 0; index < cpuLenght; index++) {
        cluster.fork()
    }

    cluster.on('exit', function (worker) {
        console.log(`child process exit: ${worker.process.pid}`)
    })
} else {
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8080)

    console.log(`Worker ${process.pid} started`);
}
```

输出结果；
```txt
cluster master run 44970
Worker 44971 started
Worker 44973 started
Worker 44974 started
Worker 44975 started
Worker 44977 started
Worker 44972 started
Worker 44978 started
Worker 44976 started
```

然后模拟process退出，使用kill -9 pid命令，输出如下
```txt
child process exit: 44971
child process exit: 44973
child process exit: 44974
child process exit: 44975
child process exit: 44976
child process exit: 44977
child process exit: 44978
child process exit: 44972
```

可以看到，在最后一个线程推出后，主线程也退出了。


![image_1dr54r9679re14dr1ipiqg12ilg.png-178.2kB][1]

从图上可以看到Cluster和Worker都可以监听事件，有断开链接的disconnect，有线程退出的exit，有相互间传递消息的message，有获取在线状态的online，有监听端口的listening。

Cluster有fork worker时的fork事件，也有判断是否是主进程的isMaster和判断是否是worker进程的isWorker，通过这些东西，可以利用多核系统运行实例。

实现一个node.js集群，借助Cluster的话需要自己实现一部分代码，网络上有现成的工具： [PM2][2]，一个集监控、运维、运行于一体的超使用工具，可以做到滚动更新、自动重启等功能，通过简单的安装和运行即可。
```sh
## 安装
npm install pm2 -g

## 启动node.js实例，已集群的方式运行
pm2 start app.js -i max
```

---
参考： 
https://nodejs.org/dist/latest-v12.x/docs/api/cluster.html#cluster_cluster


  [1]: http://static.zybuluo.com/DillonLiang/s93b50w0lxphdq6abo1d6zq3/image_1dr54r9679re14dr1ipiqg12ilg.png
  [2]: https://pm2.keymetrics.io/
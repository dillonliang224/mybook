# linux常用命令

## 根据启动脚本删除进程

替换daily-ranking为启动脚本名
```
ps -ef|grep daily-ranking|grep -v grep | cut -c 9-15 | xargs kill -s 9
```


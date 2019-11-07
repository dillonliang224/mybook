# 备份mongodb数据

使用任务数据库都免不了备份数据的问题，为了防止数据丢失或者回滚数据，最好把数据备份到另外一台服务器上。

## 脚本

写一个shell脚本，替换里面的REMOTE_IP为自己的远程服务器地址。
```sh
#!/bin/bash

LOG_DIR=/mnt/mongodb
## 数据库原始文件目录
SOURCE_DIR=/mnt/mongodb/data
## 数据库打包备份数据目录
BACKUP_DIR=/mnt/mongodb/backup

REMOTE_IP=127.0.0.1
REMOTE_USER=root
REMOTE_DIR=/mnt/mongodb


function log()
{
  echo "[ `date '+%Y-%m-%d %H:%M:%S'` ] $1"
}


# 备份
function main(){
    d=`date "+%Y%m%d%H%M%S"`
    fname=${BACKUP_DIR}/backup_${d}.tgz
    log "开始备份 ${fname}"
    tar -zcf ${fname} ${SOURCE_DIR}

    scp ${fname} $REMOTE_USER@$REMOTE_IP:$REMOTE_DIR
    log "备份到远程成功"


    log "开始删除7天前的备份"
    find ${BACKUP_DIR} -type f  -atime +7 |xargs -t -i rm {}
    log "删除完毕"
}


main >> ${LOG_DIR}/backup.log  2>&1
```

赋予执行权限：
```sh
sudo chmod 777 backup-mongodb.sh
```

尝试执行:
```sh
./backup-mongodb.sh
```

这时候执行需要另一台服务器的密码，接下来配置ssh免密登录。

## ssh免密登录

在mongodb服务器上生成密钥文件。
```sh
ssh-keygen
```

把生成的.ssh/id_rsa.pub文件里的内容复制到另一台服务器.ssh/authorized_keys里，如果没有此文件，新建一个

然后更新shell脚本
```sh
scp ${fname} $REMOTE_USER@$REMOTE_IP:$REMOTE_DIR
```
改为
```sh
scp ${fname} $REMOTE_IP:$REMOTE_DIR
```

## 配置crontab定时备份数据

在crontab里新增定时任务，每天2点全量备份数据。
```sh
0 2 * * * sh /mnt/mongodb/backup-mongodb.sh
```

## 定时删除远程服务器的备份文件

旧的备份文件，每天定时删除

```sh
#!/bin/bash

BACKUP_DIR=/mnt/mongodb
LOG_DIR=/mnt/mongodb/log

function log()
{
  echo "[ `date '+%Y-%m-%d %H:%M:%S'` ] $1"
}


# 
function main(){

    log "开始删除7天前的备份"
    find ${BACKUP_DIR} -type f  -atime +7 |xargs -t -i rm {}
    log "删除完毕"
}

main >> ${LOG_DIR}/clean_backup.log 2>&1
```

同样赋予执行权限和设置定时脚本
```sh
## 赋予权限
sudo chmod 777 clear-backup-mongodb.sh
```

```sh
## 定时脚本
0 4 * * * sh /mnt/mongodb/clear-backup-mongodb.sh
```
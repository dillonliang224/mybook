# Gitlab push/pull端口问题

>  默认情况下我们clone项目的时候，没有指定端口号，ssh默认使用22端口，但是服务器上，22端口用于ssh连接，所以我们需要更改sshd的ssh端口，然后让gitlab使用22端口。



## 修改sshd

```bash
## /etc/ssh/sshd_config
# Port 22
Port 18596

```



然后重启sshd服务并重启服务器

```bash
systemctl restart sshd
shuddown -r now
```



配置gitlab里面使用22端口就可以了，本地把ssh的端口改为185966

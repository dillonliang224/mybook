# 字节跳动面试题解析

## MySQL

#### 存储引擎

##### MyISAM

特点：

- 并发性和锁级别 （对于读写混合的操作不好，为表级锁，写入和读互斥）
- 表损坏修复
- Myisam 表支持的索引类型（全文索引）
- Myisam 支持表压缩（压缩后，此表为只读，不可以写入。使用 myisampack 压缩）
- 不支持事务和行级锁，不支持外键，并且索引和数据是分开存储的

##### InnoDB

mysql5.5及之后版本默认的存储引擎

特点：

- 事务性存储引擎，完全支持ACID

- Redo log实现事务的持久性，undo log实现回滚

- 支持行级锁

- 行级锁可以最大程度的支持并发

- 行级锁是由存储引擎层实现的

### 索引

采用B+树数据结果存储索引。

B+树的非叶子节点存储key+指向下一节点的指针，叶子节点之间通过链表相互链接

B树的非叶子节点存储key+key指向的数据+指向下一节点的指针

所以说B+树非叶子节点能存储更多的key，且利于范围查询，而B树要做中序遍历



索引的存储形式有聚簇索引和非聚簇索引，其中聚簇索引是表中的主键索引，如果没有主键索引，那么使用表中的唯一索引，如果还没有，innodb会默认创建一个隐式的主键。

非聚簇索引存储的是key和指向聚簇索引的的主键

所以如果通过非聚簇索引查询数据，它要先去非聚簇索引查询到主键ID的值，然后再去聚簇索引里查找对应的数据地址。这就是mysql里的回表现象。

当然，如果非聚簇索引包含了要查询的所有键，那么不需要回表查询，这种现象叫做索引覆盖。



### 锁的类型有哪些

mysql锁分为**共享锁**和**排他锁**，也叫做读锁和写锁。

读锁是共享的，可以通过lock in share mode实现，这时候只能读不能写。

写锁是排他的，它会阻塞其他的写锁和读锁。从颗粒度来区分，可以分为**表锁**和**行锁**两种。



表锁会锁定整张表并且阻塞其他用户对该表的所有读写操作，比如alter修改表结构的时候会锁表。

行锁又可以分为**乐观锁**和**悲观锁**，悲观锁可以通过for update实现，乐观锁则通过版本号实现。



### 事务特性和隔离级别

事务基本特性ACID分别是：

- 原子性

- 一致性

- 隔离性

- 持久性



隔离级别分别是：

- read uncommit: 读未提交，可能会读到其他事务未提交的数据，也叫做脏读。

- read commit：读已提交，两次读取结果不一致，叫做不可重复读。**不可重复读解决了脏读读问题**，它只会读取已经提交的事务。

- repeatable read： 可重复读，这是mysql的默认级别，就是每次读取结果都一样，但是**有可能产生幻读**。间隙锁+MVCC解决幻读问题

- serializable：串行，一般是不会使用的，它会给每一行读取的数据加锁，会导致大量超时和锁竞争的问题。



#### ACID靠什么保证

A原子性由undo log日志保证，它记录了需要回滚的日志信息，事务回滚时撤销已经执行成功的sql

C一致性靠AID来保证

I隔离性由MVCC来保证

D持久性由内存+redo log来保证，mysql修改数据同时在内存和redo log记录这次操作，事务提交的时候通过redo log刷盘，宕机的时候可以从redo log恢复。



### MVCC

MVCC： 多版本并发控制，实际上就是保存了数据在某个时间点的快照。



### readview

- read uncommitted隔离级别事务：直接读取记录的最新版本；

- serializable隔离级别事务：使用加锁的方式来访问记录；

- RC和RR隔离级别事务：需要用到版本链概念，核心问题是如何判断版本链中哪个版本是当前事务可见的？

- readview中四个比较重要的概念：

- m_ids：表示在生成readview时，当前系统中活跃的读写事务id列表；

- min_trx_id：表示在生成readview时，当前系统中活跃的读写事务中最小的事务id，也就是m_ids中最小的值；

- max_trx_id：表示生成readview时，系统中应该分配给下一个事务的id值；

- creator_trx_id：表示生成该readview的事务的事务id；

- 有了readview，在访问某条记录时，按照以下步骤判断记录的某个版本是否可见

- 1、如果被访问版本的trx_id，与readview中的creator_trx_id值相同，表明当前事务在访问自己修改过的记录，该版本可以被当前事务访问；

- 2、如果被访问版本的trx_id，小于readview中的min_trx_id值，表明生成该版本的事务在当前事务生成readview前已经提交，该版本可以被当前事务访问；

- 3、如果被访问版本的trx_id，大于或等于readview中的max_trx_id值，表明生成该版本的事务在当前事务生成readview后才开启，该版本不可以被当前事务访问；

- 4、如果被访问版本的trx_id，值在readview的min_trx_id和max_trx_id之间，就需要判断trx_id属性值是不是在m_ids列表中？

- 如果在：说明创建readview时生成该版本的事务还是活跃的，该版本不可以被访问

- 如果不在：说明创建readview时生成该版本的事务已经被提交，该版本可以被访问；

- 生成readview时机

- RC隔离级别：每次读取数据前，都生成一个readview；

- RR隔离级别：在第一次读取数据前，生成一个readview；

https://zhuanlan.zhihu.com/p/66791480

### 日志种类，主从同步机制，数据延迟



 日志种类 https://database.51cto.com/art/201806/576300.htm

- bin log 主要用于主从同步，把sql命令顺序写入日志
- undo log 主要实现事务的原子行
- redo log 主要实现事务的持久性
- relay log 主要用于主从同步，重放sql命令
- error log 主要查看错误日志
- slow query log 主要查看慢查询sql日志
- general log

##### redolog

1. 作用
   确保事务的持久性

防止在发生故障的时候，尚有脏页未写入磁盘（数据库的更新操作不会把数据立刻更新到磁盘，而是先更新缓存池中的数据），在重启mysql服务的时候，根据redo log进行重做，从而满足事务的持久性。

2. 内容
   物理格式的日志，记录的是物理数据页面的修改信息，其redo log是顺序写，所有很快

3. 什么时候产生
   事务提交前先写入redolog，顺序写很快，然后再提交事务

4. 什么时候释放
   对应的事物脏页被刷新到磁盘之后，redolog就可以被重用了

#### 主从复制

主从复制主要涉及三个线程：binlog线程、I/O线程和SQL线程

- binlog线程： 负责将主服务器上的数据更改写入二进制文件（binlog）中

- I/O线程：负责从主服务器上读取二进制日志文件，并写入从服务器的中继日志中

- SQL线程：负责读取中继日志并重放其中的SQL

![](http://image.dillonliang.cn/mybook/mysql-master-slave.jpg)

**从库同步主库数据库的过程是串行化的**，也就是说主从数据有一定的延时。如果主库突然宕机了，恰好数据还没有同步到从库，那么数据可能在从库上是没有的，数据丢失。

为了解决数据延时的问题，mysql提供了两种机制：

- 半同步复制： 指的是主库写入biglog日志之后，就会强制将数据同步到从库，从库将日志写入本地的relay log之后，接着会返回一个ack给主库，主库接收到至少一个从库的ack之后才会认为写操作完成
- 并行复制： 从库开多个线程，并行读取relay log中不同库的日志，然后**并行重放不同库的日志**，这是库级别的并行。

Note：
半同步复制减少了数据的丢失，但增加了额外的等待时间开销
半同步复制的过程中，主库宕机了，可能出现幻读的问题，即主库已提交并被读取数据，从库未同步完成，此时主库宕机，从库升为master，就有幻读的问题。
并行复制减小了数据延迟，但仍有数据丢失的可能

**异步复制**就是最上面所说的有从库读取二进制文件，并写入本地中继日志里，主库执行完事务后立刻返回
**全同步复制**就是主库要等所有从库复制了数据后才返回，严重影响性能

 

### 分库分表



账户600万*28

充值600万*28

购买记录700万 28库 128表

购买记录单条： 600万

金币日志：9000万 16个库



简单来说，数据的切分就是通过某种特定的条件，将我们存放在同一个数据库中的数据分散存放到多个数据库（主机）中，以达到分散单台设备负载的效果，即分库分表。

数据的切分根据其切分规则的类型，可以分为如下两种切分模式。

- 垂直（纵向）切分：把单一的表拆分成多个表，并分散到不同的数据库（主机）上。
- 水平（横向）切分：根据表中数据的逻辑关系，将同一个表中的数据按照某种条件拆分到多台数据库（主机）上。

### 读写分离

主服务器用来处理写操作以及实时性要求比较高的读操作，而从服务器用来处理读操作。

读写分离常用代理方式来实现，代理服务器接收应用层传来的读写请求，然后决定转发到哪个服务器。

MySQL 读写分离能提高性能的原因在于：

- 主从服务器负责各自的读和写，极大程度缓解了锁的争用；
- 从服务器可以配置 MyISAM 引擎，提升查询性能以及节约系统开销；
- 增加冗余，提高可用性。

![](http://image.dillonliang.cn/mybook/mysql-read-write.jpg)

### 死锁

- 超时处理

- 死锁检测

### MYSQL 主从服务器，如果主服务器是InnoDB引擎，从服务器是MyISAM引擎，应用中会遇到什么问题？

- 1.MyISAM表锁，所以每次插入都会锁表一次。

- 2.MyISAM不支持事务，备份时可能会丢失数据。

## Redis



#### 基本数据类型

- 字符串：sds

- 链表linkedlist

- 字典hashtable

- 跳跃表skiplist

- 整数集合intset

- 压缩列表ziplist



#### 为什么这么快

单机redis可以支撑每秒10几万的并发，主要因为如下几点：

- 完全基于内存操作

- C语言实现，优化过的数据结构，基于几种基础的数据结构，redis做了大量的优化，性能极高

- 使用单线程，无上下文的切换成本

- 基于非阻塞的I/O多路复用机制



#### 为什么Redis6.0之后又改用多线程呢？

redis使用多线程并非是完全摒弃单线程，redis还是使用单线程模型来处理客户端的请求，只是使用多线程来处理数据的读写和协议解析，执行命令还是使用单线程。



这样做的目的是因为redis的性能瓶颈在于网络IO而非CPU，使用多线程能提升IO读写的效率，从而整体提高redis的性能。





主从复制： [Redis主从复制的配置和实现原理 - 掘金](https://juejin.im/post/6844903943764443149)

### 压缩用什么算法

lzf，压缩列表

## MQ

#### 如何保证消息队列的高可用

RabbitMQ有三种模式：

- 单机模式
- 普通集群模式
- 镜像集群模式

##### 单机模式

单机模式无高可用性，demo级别，

##### 普通集群模式

普通集群模式，意思就是在多台机器上启动多个 RabbitMQ 实例，每个机器启动一个。你创建的 queue，只会放在一个 RabbitMQ 实例上，但是每个实例都同步 queue 的元数据（元数据可以认为是 queue 的一些配置信息，通过元数据，可以找到 queue 所在实例）。你消费的时候，实际上如果连接到了另外一个实例，那么那个实例会从 queue 所在实例上拉取数据过来。

优点：

1. 提高了吞吐量

缺点：

1. MQ集群内部可能产生大量的数据传输（数据所在的节点和消费者连接的节点不是同一个）
2. 可用性无保障，queue所在节点宕机了，数据就没了（需要配合持久化使用）

##### 镜像集群模式

**真正的高可用模式**

跟普通集群模式不一样的是，在镜像集群模式下，你创建的 queue，无论元数据还是 queue 里的消息都会存在于多个实例上，就是说，每个 RabbitMQ 节点都有这个 queue 的一个完整镜像，包含 queue 的全部数据的意思。然后每次你写消息到 queue 的时候，都会自动把消息同步到多个实例的 queue 上。

优点：

1. 高可用，单节点宕机不影响消息的消费

缺点：

1. 扩展性比较差，新增节点并不能扩展性能
2. 每个节点都有全部的元数据和消息

#### 如何保证消息不被重复消费

换句话说，就是如何保证幂等xing
这个要根据具体的业务来分析：

- 比如你拿个数据要写库，你先根据主键查一下，如果这数据都有了，你就别插入了，update 一下好吧。
- 比如你是写 Redis，那没问题了，反正每次都是 set，天然幂等性。
- 比如你不是上面两个场景，那做的稍微复杂一点，你需要让生产者发送每条数据的时候，里面加一个全局唯一的 id，类似订单 id 之类的东西，然后你这里消费到了之后，先根据这个 id 去比如 Redis 里查一下，之前消费过吗？如果没有消费过，你就处理，然后这个 id 写 Redis。如果消费过了，那你就别处理了，保证别重复处理相同的消息即可。
- 比如基于数据库的唯一键来保证重复数据不会重复插入多条。因为有唯一键约束了，重复数据插入只会报错，不会导致数据库中出现脏数据。

#### 如何保证消息的可靠性传输

如何处理消息丢失的问题？

消息丢失可能在生产者，MQ，消费者中。

1. **生产者丢失消息**，怎么办？可以通过开启rabbitmq 事务的方式
   事务都有一个特性，要么成功，要么失败回滚，失败了就再次发一次

2. **Rabbitmq丢失数据**，就是 RabbitMQ 自己弄丢了数据，这个你必须开启 RabbitMQ 的持久化，就是消息写入之后会持久化到磁盘，哪怕是 RabbitMQ 自己挂了，恢复之后会自动读取之前存储的数据，一般数据不会丢。除非极其罕见的是，RabbitMQ 还没持久化，自己就挂了，可能导致少量数据丢失，但是这个概率较小。

设置持久化有两个步骤：

创建 queue 的时候将其设置为持久化
这样就可以保证 RabbitMQ 持久化 queue 的元数据，但是它是不会持久化 queue 里的数据的。

第二个是发送消息的时候将消息的 deliveryMode 设置为 2
就是将消息设置为持久化的，此时 RabbitMQ 就会将消息持久化到磁盘上去。

必须要同时设置这两个持久化才行，RabbitMQ 哪怕是挂了，再次重启，也会从磁盘上重启恢复 queue，恢复这个 queue 里的数据。

注意，哪怕是你给 RabbitMQ 开启了持久化机制，也有一种可能，就是这个消息写到了 RabbitMQ 中，但是还没来得及持久化到磁盘上，结果不巧，此时 RabbitMQ 挂了，就会导致内存里的一点点数据丢失。

所以，持久化可以跟生产者那边的 confirm 机制配合起来，只有消息被持久化到磁盘之后，才会通知生产者 ack 了，所以哪怕是在持久化到磁盘之前，RabbitMQ 挂了，数据丢了，生产者收不到 ack ，你也是可以自己重发的。

3. **消费者丢失消息**，RabbitMQ 如果丢失了数据，主要是因为你消费的时候，刚消费到，还没处理，结果进程挂了，比如重启了，那么就尴尬了，RabbitMQ 认为你都消费了，这数据就丢了。

这个时候得用 RabbitMQ 提供的 ack 机制，简单来说，就是你必须关闭 RabbitMQ 的自动 ack ，可以通过一个 api 来调用就行，然后每次你自己代码里确保处理完的时候，再在程序里 ack 一把。这样的话，如果你还没处理完，不就没有 ack 了？那 RabbitMQ 就认为你还没处理完，这个时候 RabbitMQ 会把这个消费分配给别的 consumer 去处理，消息是不会丢的。

![此处输入图片的描述][7]

#### 如何保证消息的顺序性

①拆分多个queue，每个queue一个consumer，就是多一些queue而已，确实是麻烦点；这样也会造成吞吐量下降，可以在消费者内部采用多线程的方式取消费。
![此处输入图片的描述][8]

②或者就一个queue但是对应一个consumer，然后这个consumer内部用内存队列做排队，然后分发给底层不同的worker来处理

----------

#### 如何设计MQ

从高可用、可扩展、持久化、分布式考虑

#### 如何处理消息积压

1个queue拆分为多个queue，每个queue启多个消费者，消费完后改为原有架构

## RPC调用过程

## 垃圾回收算法

### 引用计数

优点：

1。 及时清理内存

缺点：

1。 需要存储引用计数

2。 无法处理循环引用

3。 非线程安全的处理引用计数

4。 浪费CPU资源，即使内存够用，仍然在运行时进行计数器的统计

### 标记清除

解决了引用计数垃圾回收算法的缺点，但是也带来新的缺点

1。 全面扫描，非及时清除

2。 内存碎片问题

### 标记整理

优点：

1。 解决了内存碎片的问题

缺点：

1。 每一次整理内存空间后，各存活对象按照相对的前后位置从初始位置开始重新连续地分配内存空间，代码中内存地址的改变势必会带来大量额外的逻辑运算处理，来保证内存移动后，代码中的地址也能正确的更新，

2。 不可预测的内存地址改变会给调试程序增加难度。

### 复制算法

复制算法的核心就是，将原有的内存空间一分为二，每次只用其中的一块，在垃圾回收时，将正在使用的对象复制到另一个内存空间中，然后将该内存空间清空，交换两个内存的角色，完成垃圾的回收。  
如果内存中的垃圾对象较多，需要复制的对象就较少，这种情况下适合使用该方式并且效率比较高，反之，则不适合。

优点 ： 1、在垃圾对象多的情况下，效率较高。 2、清理后，内存无碎片。

 缺点 ： 1、在垃圾对象少的情况下，不适用，如 ：老年代内存。 2、分配的2块内存空间，在同一时刻，只能使用一半，内存使用率较低。

### 分代算法

前面介绍了很多种回收算法，每一种算法都有自己的优点也有缺点，谁都不能替代谁，所以根据垃圾回收对象的特点进行选择，才是明智的选择。 分代算法其实就是这样的，根据回收对象的特点进行选择，在jvm中，年轻代适合使用复制算法，老年代适合使用标记清除或标记压缩算法。

## HTTP / HTTP2 / HTTPS

http请求的整个链路

301/302区别

cookie/session/csrf及防御方法

长链接/短链接

dns劫持

## Linux

### TCP/UDP/Websocket

### select/poll/epoll

### 进程间通信

### 用户线程和系统线程，系统线程切换为什么这么慢

### 虚拟内存和物理内存怎么映射

### linux删除文件夹下的所有日志，递归

### 自旋锁是什么？为什么要用？用户态和内核态切换要做什么？上下文切换主要做了什么？

自旋锁与互斥锁

- 自旋锁与互斥锁都是为了实现保护资源共享的机制。

- 无论是自旋锁还是互斥锁，在任意时刻，都最多只能有一个保持者。

- 获取互斥锁的线程，如果锁已经被占用，则该线程将进入睡眠状态；获取自旋锁的线程则不会睡眠，而是一直循环等待锁释放。
  
  总结：

- 自旋锁：线程获取锁的时候，如果锁被其他线程持有，则当前线程将循环等待，直到获取到锁。

- 自旋锁等待期间，线程的状态不会改变，线程一直是用户态并且是活动的(active)。

- 自旋锁如果持有锁的时间太长，则会导致其它等待获取锁的线程耗尽CPU。

- 自旋锁本身无法保证公平性，同时也无法保证可重入性。

- 基于自旋锁，可以实现具备公平性和可重入性质的锁。

- TicketLock:采用类似银行排号叫好的方式实现自旋锁的公平性，但是由于不停的读取serviceNum，每次读写操作都必须在多个处理器缓存之间进行缓存同步，这会导致繁重的系统总线和内存的流量，大大降低系统整体的性能。

- CLHLock和MCSLock通过链表的方式避免了减少了处理器缓存同步，极大的提高了性能，区别在于CLHLock是通过轮询其前驱节点的状态，而MCS则是查看当前节点的锁状态。

- CLHLock在NUMA架构下使用会存在问题。在没有cache的NUMA系统架构中，由于CLHLock是在当前节点的前一个节点上自旋,NUMA架构中处理器访问本地内存的速度高于通过网络访问其他节点的内存，所以CLHLock在NUMA架构上不是最优的自旋锁。

### 查询文件中出现次数最多的url(linux命令)

## 微服务

### 限流方案

### 一致性哈希

### 服务治理有哪些模块

### 注册中心原理

### 为什么配置中心也属于服务治理

### 链路监控的原理

#### 全链路压测怎么做，遇到了什么问题

## 分布式

### 分布式锁

### 分布式事务

- 二次提交

- TCC

- 补偿机制

- 事务性消息

### 分布式存储

## 系统设计

### 短链设计

### 网站排查问题

### 10亿视频，平均50弹幕

### 秒杀系统设计

### 健康码更新定位原理

### 分库分表方案，淘宝订单场景，能按卖家ID和卖家ID+订单ID查询

### 任意精度的延时队列怎么设计？堆的插入时间复杂度是多少？

### 微博点赞场景，能查用户点赞记录、不能重复点赞、能查当天热榜Top10

### 设计直播送礼系统

### 设计微信红包系统

## 算法题

### 迷宫回路（回溯搜索）

### 二叉树遍历，不允许标记访问过的节点，且只用一个栈

### 股票买卖

### 打印出二叉树所有和为N的路径

### 贪心算法



#### 数字刚好大一个数字



### 子集

#### 返回该数组所有可能的子集（幂集）

```go
func subsets(nums []int) [][]int {
	sort.Slice(nums, func(i, j int) bool {
		return nums[i] < nums[j]
	})
	r := make([][]int, 0)
	r = append(r, []int{})
	count := 0

	for count < len(nums) {
		tempR := make([][]int, 0)
		for _, v := range r {
			temp := make([]int, 0)
			temp = append(temp, v...)
			temp = append(temp, nums[count])
			tempR = append(tempR, temp)
		}
		count++

		for _, i := range tempR {
			r = append(r, i)
		}
	}

	return r
}
```





### 链表：奇数生序，偶数降序

### 64匹赛马

### LC152 乘积最大子数组

### 一个长字符串，一个不重复的字符串数组，找到一个子串，内容与数组相同

### 岛屿问题

### 搬家

### 最大子数组，子数组可以组成顺子

### 组合： 1-26对于a-z字母，组合情况

### 二叉树的子结构

### 9个人一个骰子一份礼物，公平的送礼

### 多路归并，数组求子数组最大和

### 手写快排

### 判断对此二叉树

### 堵塞队列、堆排序、第k大的数字

### 找出字符串中没有重复字符串的最长子串的长度？

### 一个数组、一个目标值，求连续子数组，是（目标值-连续子数组和）最小，双指针

### 单链表，每N个一组进行翻转

### 大数减法

### 链表

#### 两数相加

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    result := &ListNode{0, nil}
    carry := 0
    cur := result

    for l1 != nil || l2 != nil {
        tem := 0
        if l1 != nil {
            tem += l1.Val
            l1 = l1.Next
        }

        if l2 != nil {
            tem += l2.Val
            l2 = l2.Next
        }

        c := (tem + carry) / 10
        nodeVal := (tem + carry) % 10
        node := &ListNode{nodeVal, nil}
        carry = c
        cur.Next = node
        cur = node
    }

    if carry > 0 {
        cur.Next = &ListNode{carry, nil}
    }

    return result.Next
}
```

#### 翻转链表

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func reverseList(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return head
    }

    var pre *ListNode
    var current *ListNode

    var next = head

    for next != nil {
        current = next.Next
        next.Next = pre
        pre = next
        next = current
    }

    return pre
}
```

#### 链表中倒数第K个节点

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func getKthFromEnd(head *ListNode, k int) *ListNode {
    if head == nil || k <= 0 {
        return nil
    }

    var quick = head
    var slow = head
    var count = 0

    for quick != nil {
        if count == k {
            quick = quick.Next
            slow = slow.Next
        } else {
            quick = quick.Next
            count++
        }
    }

    return slow
}
```

#### 删除链表的倒数第N个节点

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    if n == 0 || n == 1 {
        return nil
    }
    var quick *ListNode = head
    var slow *ListNode = head
    var slowPre *ListNode = head
    for i := 0; i < n - 1; i++ {
        quick = quick.Next
    }

    for quick != nil && quick.Next != nil {
        quick = quick.Next
        slowPre = slow
        slow = slow.Next
    }

    slowPre.Next = slow.Next
    return head
}
```

#### 合并两个排序的链表

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    var nList = &ListNode{0, nil}
    cur := nList

    for l1 != nil && l2 != nil {
        if l1.Val >= l2.Val {
            cur.Next = &ListNode{l2.Val, nil}
            l2 = l2.Next
        } else {
            cur.Next = &ListNode{l1.Val, nil}
            l1 = l1.Next
        }
        cur = cur.Next
    }

    if l1 != nil {
        cur.Next = l1
    }

    if l2 != nil {
        cur.Next = l2
    }

    return nList.Next
}
```

#### 合并K个升序链表

#### 单链表，每N个翻转

#### 链表是否有环

#### 链表：奇数生序，偶数降序

#### 奇偶链表

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func oddEvenList(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return head
    }

    head2 := head.Next
    p1 := head
    p2 := head2
    for p1.Next != nil && p2.Next != nil {
        p1.Next = p2.Next
        p1 = p1.Next
        p2.Next = p1.Next
        p2 = p2.Next
    }

    p1.Next = head2
    return head
}
```

## 大数据处理

### 大文件topK

### 其他

sql题，出现过2次及以上相同名字的人的名字

### 正则： 写一个手机号的正则表达式，13开头，11位数

```bash
/^13\d{9}$/
```

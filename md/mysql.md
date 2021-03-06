## 事务隔离级别

1. 串行化 (Serializable)

所有事务一个接着一个的执行，这样可以避免幻读 (phantom read)，对于基于锁来实现并发控制的数据库来说，串行化要求在执行范围查询的时候，需要获取范围锁，如果不是基于锁实现并发控制的数据库，则检查到有违反串行操作的事务时，需回滚该事务。

2. 可重复读 (Repeated Read)

所有被 Select 获取的数据都不能被修改，这样就可以避免一个事务前后读取数据不一致的情况。但是却没有办法控制幻读，因为这个时候其他事务不能更改所选的数据，但是可以增加数据，即前一个事务有读锁但是没有范围锁，为什么叫做可重复读等级呢？那是因为该等级解决了下面的不可重复读问题。

注意：现在主流数据库都使用 MVCC 并发控制，使用之后RR（可重复读）隔离级别下是不会出现幻读的现象。

3. 读已提交 (Read Committed)

被读取的数据可以被其他事务修改，这样可能导致不可重复读。也就是说，事务读取的时候获取读锁，但是在读完之后立即释放(不需要等事务结束)，而写锁则是事务提交之后才释放，释放读锁之后，就可能被其他事务修改数据。该等级也是 SQL Server 默认的隔离等级。

4. 读未提交 (Read Uncommitted)

最低的隔离等级，允许其他事务看到没有提交的数据，会导致脏读。

**总结**

- 四个级别逐渐增强，每个级别解决一个问题，每个级别解决一个问题，事务级别遇到，性能越差，大多数环境(Read committed 就可以用了)

| 隔离级别 | 脏读  | 不可重复读 | 幻影读 |
| ---- | --- | ----- | --- |
| 未提交读 | √   | √     | √   |
| 提交读  | ×   | √     | √   |
| 可重复读 | ×   | ×     | √   |
| 可串行化 | ×   | ×     | ×   |

## 存储引擎

### MyISAM

特点：

- 并发性和锁级别 （对于读写混合的操作不好，为表级锁，写入和读互斥）
- 表损坏修复
- Myisam 表支持的索引类型（全文索引）
- Myisam 支持表压缩（压缩后，此表为只读，不可以写入。使用 myisampack 压缩）

### InnoDB

mysql5.5及之后版本默认的存储引擎

特点：

- 事务性存储引擎，完全支持ACID

- Redo log实现事务的持久性，undo log实现回滚

- 支持行级锁

- 行级锁可以最大程度的支持并发

- 行级锁是由存储引擎层实现的

## 数据库中最大的连接数参数意义

- SetMaxOpenConns： 用于设置最大打开的连接数，默认值为0表示不限制

- SetMaxIdleConns： 用于设置闲置的连接数

- SetConnMaxLifetime: 用于设置连接超时

## 

## 分库分表

简单来说，数据的切分就是通过某种特定的条件，将我们存放在同一个数据库中的数据分散存放到多个数据库（主机）中，以达到分散单台设备负载的效果，即分库分表。

数据的切分根据其切分规则的类型，可以分为如下两种切分模式。

- 垂直（纵向）切分：把单一的表拆分成多个表，并分散到不同的数据库（主机）上。
- 水平（横向）切分：根据表中数据的逻辑关系，将同一个表中的数据按照某种条件拆分到多台数据库（主机）上。

## 主从复制

主从复制主要涉及三个线程：binlog线程、I/O线程和SQL线程

- binlog线程： 负责将主服务器上的数据更改写入二进制文件（binlog）中

- I/O线程：负责从主服务器上读取二进制日志文件，并写入从服务器的中继日志中

- SQL线程：负责读取中继日志并重放其中的SQL

![](http://image.dillonliang.cn/mybook/mysql-master-slave.jpg)

## 读写分离

主服务器用来处理写操作以及实时性要求比较高的读操作，而从服务器用来处理读操作。

读写分离常用代理方式来实现，代理服务器接收应用层传来的读写请求，然后决定转发到哪个服务器。

MySQL 读写分离能提高性能的原因在于：

- 主从服务器负责各自的读和写，极大程度缓解了锁的争用；
- 从服务器可以配置 MyISAM 引擎，提升查询性能以及节约系统开销；
- 增加冗余，提高可用性。

![](http://image.dillonliang.cn/mybook/mysql-read-write.jpg)

## MVCC

MVCC（多版本并发控制）

## ACID

- 原子性：一个事务操作，要么同时成功，要么同时失败回滚，不存在只执行一部分的情况

- 一致性： 数据库总是从一个一致性的状态转换到另一个一致性的状态，在事务开始之前和之后，数据库的完整性约束没有被破坏。

- 隔离性： 一个事务内部的操作不会影响其他事务的操作

- 持久性： 事务一旦提交，对数据库的改变就应该是永久性的，接下来的其他操作或故障不应该对其有任务影响。

通过mysql的redo log来保证事务的持久性

通过mysql的undo log来保证事务的原子性和隔离性

上面两条都ok的情况下保证了事务的一致性

## 事务原理

要点：

1. Mysql中不是所有的存储引擎都支持事务

2. Mysql默认采用的是自动提交的方式

3. Mysql默认的隔离级别是可重复读（RR）

4. Mysql的存储引擎是可插拔的

### InnoDB原理

## 锁

- 记录锁： 基于索引，锁定某条记录

- 间隙锁： 锁定一定范围，解决幻读

- Next-key Lock（记录锁+间隙锁）

- 意向锁（读锁、写锁）： 表锁

## 其他

### autoIncrement

mysql里可以设置某个字段的自增属性，autoIncrement，需要注意的是，autoIncrement是要加表锁的，高并发的情况下，影响性能

---

参考：

[事务的基本概念，Mysql事务处理原理](https://mp.weixin.qq.com/s/OcjxlP1FOBrc-EelUA-fVg)

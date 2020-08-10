[toc]

## 基本功能


## 高级功能

### Redis持久化

http://dillonliang.cn/2018/10/17/redis%E6%8C%81%E4%B9%85%E5%8C%96/

### Redis的过期策略


#### 设置过期时间

```bash
## 最常用的方式
expire key time

## 字符串独有
setex key time value
```

如果一个key没有设置过期时间，那么就是永久有效

#### 三种过期策略

##### 定时删除

在设置key的过期时间的同时，为key设置一个定时器，当key过期时间到了之后，定时器执行删除操作

优点： key能被及时删除

缺点： 每个key都创建定时器，影响机器性能，如果过期key很多，CPU删除操作也会占用大量的时间

##### 惰性删除

key过期的时候不删除，等到下次获取key的时候，去检查是否过期，如果过期了则删除并返回null

优点： key获取的时候删除，CPU占用时间短

缺点： 如果大量的key在之后的很长一段时间没有用到，将发生内存泄漏

##### 定期删除

每隔一段时间执行一次删除过期key操作

是定时删除和惰性删除的折中，可限制删除操作的时长和频率，又可兼容惰性删除的缺点

#### 结论

redis采用**定期删除+惰性删除**，控制时长和频率的情况下删除过期key。

惰性删除流程：
- 在进行get或setnx等操作时，先检查key是否过期
- 若过期，删除key，然后执行相应操作
- 若没过期，直接执行相应操作

定期删除流程：
- 遍历每个数据库（redis.conf中配置的"database"数量，默认为16）
- 检查当前库中的指定个数key（默认20个）
	- 如果当前库中没有一个key设置了过期时间，直接执行下一个库的遍历
	- **随机**获取一个设置了过期时间的key，检查该key是否过期，如果过期，删除key
	- 判断定期删除操作是否已经达到指定时长，若已经达到，直接退出定期删除


### Redis的淘汰策略

如果定期删除漏掉了很多过期key，也没有走惰性删除，还是会造成内存泄漏的风险。所以在过期策略下又有淘汰策略。

Redis的淘汰策略有以下几个：
- noeviction: 当内存不足以容纳新写入数据时，新写入操作会报错
- allkeys-lru: 当内存不足以容纳新写入数据时，在键空间中，移除最近最少使用的key
- allkeys-random: 当内存不足以容纳新写入数据时，在键空间中，随机移除某个key
- volatile-lru: 当内存不足以容纳新写入数据时，在设置了过期时间的键空间中，移除最近最少使用的key
- volatile-random: 当内存不足以容纳新写入数据时，在设置了过期时间的键空间中，随机移除某个key
- volatile-ttl: 当内存不足以容纳新写入数据时，在设置了过期时间的键空间中，有更早过期时间的key优先移除

采用allkeys-lru最近最少使用的淘汰策略最好


## 原理 && 架构

### 底层数据机构

常用的数据类型都是由以下数据结构构成的。

- 简单动态字符串SDS
- 链表
- 字典
- 跳跃表
- 整数集合
- 压缩列表

#### 简单动态字符串SDS

SDS的结构定义在sds.h文件中，SDS的定义在Redis 3.2版本之后有一些改变，由一种数据结构变成了5种数据结构，会根据SDS存储的内容长度来选择不同的结构，以达到节省内存的效果，具体的结构定义


```c
// 3.0
struct sdshdr {
    // 记录buf数组中已使用字节的数量，即SDS所保存字符串的长度
    unsigned int len;
    // 记录buf数据中未使用的字节数量
    unsigned int free;
    // 字节数组，用于保存字符串
    char buf[];
};

// 3.2
/* Note: sdshdr5 is never used, we just access the flags byte directly.
 * However is here to document the layout of type 5 SDS strings. */
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; /* used */
    uint8_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};

```

其中:
- len: 代表当前已使用的字节数
- alloc: 记录当前字节数组总共分配的字节数量
- flags: 标记当前字节数组的属性，是sdshdr8还是sdshdr16等
- buf: 字节数组，用于保存字符串


> 常数复杂度获取字符串长度

> SDS实现了空间预分配和惰性空间释放两种优化的空间分配策略，解决了字符串拼接和截取的空间问题


#### 链表

链表，常用的数据结构，易于插入和删除，内存利用率高

定义的结构体：
```c
typedef struct listNode {
    // 前置节点
    struct listNode *prev;
    // 后置节点
    struct listNode *next;
    // 节点值
    void *value;
} listNode;


typedef struct list {
    // 链表头节点
    listNode *head;
    // 链表尾节点
    listNode *tail;
    // 节点值复制函数
    void *(*dup)(void *ptr);
    // 节点值释放函数
    void (*free)(void *ptr);
    // 节点值对比函数
    int (*match)(void *ptr, void *key);
    // 链表所包含的节点数量
    unsigned long len;
} list;

```

redis里链表特点：
- 双端链表：带有head\tail节点，且有前置节点和后置节点，方便遍历
- 无环： 表头节点的prev和表尾节点的next都指向NULL，对链表的访问以NULL结束
- 获取链表长度的复杂度为O(1)
- 支持多种数据类型元素


#### 字典

hash表实现

#### 跳跃表

常用数据结构：跳跃表实现

#### 整数集合

整数集合（intset）是Redis用于保存整数值的集合抽象数据结构，可以保存类型为int16_t、int32_t、int64_t的整数值，并且保证集合中不会出现重复元素

```c
typedef struct intset {
    // 编码方式
    uint32_t encoding;
    // 集合包含的元素数量
    uint32_t length;
    // 保存元素的数组
    int8_t contents[];
} intset;

```

contents数组：整数集合的每个元素在数组中按值的大小从小到大排序，且不包含重复项

length记录整数集合的元素数量，即contents数组长度

encoding决定contents数组的真正类型，如INTSET_ENC_INT16、INTSET_ENC_INT32、INTSET_ENC_INT64

#### 压缩列表


### 常用数据结构的底层

Redis的主要底层数据结构，包括简单动态字符串（SDS）、链表、字典、跳跃表、整数集合、压缩列表。但是Redis并没有直接使用这些数据结构来构建键值对数据库，而是基于这些数据结构创建了一个对象系统，也就是我们所熟知的可API操作的Redis那些数据类型，如字符串(String)、列表(List)、散列(Hash)、集合(Set)、有序集合(Sorted Set)

根据对象的类型可以判断一个对象是否可以执行给定的命令，也可针对不同的使用场景，对象设置有多种不同的数据结构实现，从而优化对象在不同场景下的使用效率。


可以通过**object encoding**查看某个key的底层实现





参考： https://juejin.im/post/6844903936520880135







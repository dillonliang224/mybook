# Prometheus 普罗米修斯

## Introduction



**什么是Prometheus?**



### Overview

Prometheus是最初在SoundCloud上构建的开源监控和告警系统。

自2012年成立以来，许多公司和组织采用了Prometheus，并且该项目拥有活跃的开发者和社区。

现在，它是一个独立的项目，并且独立于任何公司进行维护。

为了强调这一点并阐述项目的治理结构，Prometheus在2016年加入了Cloud Native Computing Foundation(CNCF 云原生基金会)，是继Kubernetes之后的第二个托管项目 。



#### Features

Prometheus的主要功能有：

- 一个多维数据模型，其中包含通过metric name和键/值对标识的时间序列数据

- PromQL, 一种灵活的查询语言用来检索不同维度的数据

- 不依赖分布式存储；单个服务器节点是自治的

- 时间序列收集通过HTTP上的拉模型进行

- 通过中间网关支持推送时间序列

- 通过服务发现或静态配置发现目标

- 多种图形和仪表盘支持模式



#### Components

Prometheus生态系统由多个组建组成，其中许多是可选的：

- Prometheus主服务器，收集并存储时间序列数据

- 客户端库，支持多种语言快速开发

- 支持生命周期短的job主动推送的网关

- special-purpose [exporters](https://prometheus.io/docs/instrumenting/exporters/) for services like HAProxy, StatsD, Graphite, etc.

- 告警处理器

- 各种支持工具



大多数Prometheus组件都是用Go编写的，从而使其易于构建和部署为静态二进制文件。



#### Architecture

该图说明了Prometheus的体系结构及其某些生态系统组件:

![](https://prometheus.io/assets/architecture.png)



Prometheus直接或间接（推送网关）收集metrics数据。它在本地存储所有的时序数据并对这些数据运行规则，以汇总和记录现有数据中的新时间序列或生成告警。Grafana或其他API消费者可以可视化收集的metrics数据。



Prometheus适合那些需要采样分析的系统，监控指标，发送报警。

对于那些需要详细记录的监控，比如说订单系统，就不适合，Prometheus不会收集的那么详细，计算资源也可能不够。



### First Steps

Prometheus: 欢迎来到我的世界，娇贵的小公主。

Prometheus: 我是一个通过HTTP请求收集各个endpoints上metrics的监控平台。

Prometheus: 接下来我会告诉你如何安装、配置，并监控第一个资源demo。

Prometheus: 你需要下载并安装Prometheus，也要下载exporter(一个从服务器上导出metrics的工具)，我们的第一个demo将是Prometheus本身，它会提供一系列的监控指标，比如说：内存使用情况，GC等等。



#### Downloading Prometheus

根据你的平台，选择最新release下载并解压：

```bash
tar xvfz prometheus-*.tar.gz
cd prometheus-*
```

解压出来的Prometheus server是一个单独的二进制文件： prometheus(或者prometheus.exe windows系统)。

我们可以直接执行--help flag查看帮助。

```bash
./prometheus --help
```

在开始使用Prometheus之前，让我们配置一下它吧。



#### Configuring Prometheus

[First steps | Prometheus](https://prometheus.io/docs/introduction/first_steps/)



## Concepts

### Data model

Prometheus从根本上把所有数据存为时序数据：属于同一度量标准和同一组标注维的带有时间戳的值流。除了存储的时间序列外，Prometheus可能会生成临时的导出时间序列作为查询的结果。



#### Metric names and labels

每个时间序列均由其**metric name**和可选的**键值对(label)**作为唯一标识

metric name一般指定要度量的功能（比如说http_requests_total, 代表接受到的http requests的总和）。它可能包含ASCII字母和数字，以及下划线和冒号。它必须与正则表达式[a-zA-Z _：] [a-zA-Z0-9 _：] *相匹配。



Note: 冒号是为用户定义的记录规则保留的。

> They should not be used by exporters or direct instrumentation.



可以通过labels的自由组合来采集时序数据并展示。

labels名字可能包含ASCII字母、数字以及下划线。下划线开头的labels被保留为内部使用。

label值可以包含任何Unicode字符。

如果一个label只有key，没有value，那么这个label相当于不存在。



举个🌰：

```shell
api_http_requests_total{method="POST", handler="/messages"}
```

其中api_http_requests_total为要度量的metric name

method="POST"和handler="/message"是可选的labels



### Metric types

Prometheus客户端库提供了4个核心metric类型

#### Counter

记录app里累计的数值，此值只能被增加或者重启的时候被重置。

#### Gauge

记录单个指标的任意的上升或下降，比如说温度计或当前内存的使用量，当前系统正在处理的请求数

#### Histogram

直方图，比如说统计一段时间内的请求时间，响应大小，采样统计。

#### Summary

和histogram类似，但可以统计被观测者数据的total和sum.

### Jobs and instances

在prometheus里，待抓取的endpoint被称为*instance*，通常是一个进程。

多个具有相同目的的instance(比如集群中相同代码的实例)的集合，被称为*job*。



For example, 一个提供API的服务job拥有4个相同的instance:

- job: api-server
  
  - instance1: 1.2.3.4:5670
  
  - instance2: 1.2.3.4:5671
  
  - instance3: 5.6.7.8:5670
  
  - instance4: 5.6.7.8:5671



#### Automatically generated labels and time series

当Prometheus抓取目标时，它会自动在抓取的时间序列上附加一些标签，以识别被抓取的目标：

- job: 被抓取目标所属job名称。

- instance: 被抓取目标URL中的<host>:<port>



对于每个被抓取的instance，prometheus会存储一些重要的指标：

- up{job="job-name", instance="instance-id"}: 如果instance健康的，设置为1，否则设置为0





## Prometheus



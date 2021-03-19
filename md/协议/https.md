# HTTPS

HTTP明文传输，客户端与服务端通信内容可抓包获取。

风险：

- 窃听风险：抓包，获取敏感信息

- 篡改风险：修改通信内容

- 冒充风险：假冒网站，损失钱财

HTTPS在HTTP层与TCP层之间加入了TLS协议，来解决上述问题。

> TLS协议： 传输层安全性协议（Transport Layer Security）

![https://mmbiz.qpic.cn/mmbiz_jpg/J0g14CUwaZeMSNGtbYLcgAkWmcscQz2FkDKoDib57FOWVb8zZyXf65GEme6ibHkPTVxOmazHqicLDicX7iacFFMt22A/640](https://mmbiz.qpic.cn/mmbiz_jpg/J0g14CUwaZeMSNGtbYLcgAkWmcscQz2FkDKoDib57FOWVb8zZyXf65GEme6ibHkPTVxOmazHqicLDicX7iacFFMt22A/640)

TLS协议是如何解决HTTP的风险呢？

- 信息加密：HTTP交互信息是被加密的，第三方就无法获取；

- 校验机制：校验信息传输过程中是否有被第三方篡改过，如果被篡改过，则会有警告提示；

- 身份证书：给网站颁发证书，证明真实性；

通过TLS协议，能保证HTTP通信是安全的了，在进行HTTP通信前，需要先进行TLS握手，流程如下：

![// TODO图片](https://mmbiz.qpic.cn/mmbiz_png/J0g14CUwaZeMSNGtbYLcgAkWmcscQz2FpC63OTRvfL58f1ia8BMeWkV4JiaWP3H7icHXRNzRicOcAgksdHEKhfghDA/640)

> 

通常经过「四个消息」就可以完成TLS握手，也就是需要2个RTT的时延，然后就可以在安全的通信环境里发送HTTP报文，实现HTTP协议。

> RTT(Round Trip Delay): 来回通信延迟

So，HTTPS是应用层协议，需要先完成TCP连接建立，然后走TLS握手过程后，才能建立通信安全的连接。

HTTP内容是明文，HTTPS通过加密防止被裸露，为了加解密的性能考虑，客户端和服务端的加密采用的是对称加密密钥，而对称加密密钥是不能被泄漏的，为了保证对称加密密钥的安全行，在TLS握手阶段会采用非对称加密的方式来保护对称加密密钥，这个工作就是密钥交互算法负责的。



### RSA握手过程

传统的TLS握手基本都是使用RSA算法来实现密钥交换的，在将TLS证书部署服务端时，证书文件中包含一对公私钥，其中公钥会在TLS握手阶段传递给客户端，私钥一直留在服务端，一定要确保私钥不能被窃取。



在RSA密钥协商算法中，客户端会生成随机密钥，并使用服务端的公钥加密后再传给服务端。根据非对称加密算法，公钥加密的消息仅能通过私钥解密，这样服务端解密后，双方就得到了相同的密钥，再用它加密应用信息。



![](https://mmbiz.qpic.cn/mmbiz_png/J0g14CUwaZeMSNGtbYLcgAkWmcscQz2FUFgpNul4Wsl9bo0nPW4eQQVGwawWqnspllfnHibd7DfZic9PhwGk3Qibg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



### RSA算法的缺陷

**使用RSA密钥协商算法的最大问题是不支持前向保密**，一旦服务端的私钥泄漏了，过去被第三方截获的所有TLS通讯密文都会被破解。



### DH密钥协商算法





![](https://mmbiz.qpic.cn/mmbiz_png/J0g14CUwaZeMSNGtbYLcgAkWmcscQz2FNtnx63504UXDmkkECwp82HxYuGot1u8wIBiapBax2dyQhbsWiaykCIDA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



DH密钥交换过程中，即使第三方截获了TLS握手阶段传递的公钥，在不知道私钥的情况下，也是无法计算出密钥的，而且每一次对称加密密钥都是实时生成的，实现前向保密。



但因为DH算法但计算效率问题，后面出现了ECDHE密钥协商算法，现在大多数网站使用的正是ECDHE密钥算法。



### ECDHE密钥协商算法



#### DH算法

1. 公开算法模数和底数P和G
2. 客户端和服务端各自生成一个随机数作为私钥c,s
3. 客户端和服务端根据离散对数计算出自己的公钥C = G ^ c (mod P)  S = G ^ s (mod P)
4. 交换各自的公钥，设计接口，客户端传公钥信息，返回服务端的公钥信息，服务端的公钥针对客户端ID唯一，每次动态生成
5. 客户端有： C, c, P, G, S
   服务端有： S, s, P, G, C
   计算各自的K：
   客户端K：S ^ c (mod P)
   服务端K：C ^ s (mod P)
   K作为客户端和服务端之间用的对称加密密钥

如果服务端的公钥不变，黑客就会截获海量的密钥协商过程，计算出服务端的私钥，进而计算出会话密钥，也就不具备前向安全性。
所以每次密钥交换通信时，都是随机生成的、临时的私钥，这就是DHE算法

#### ECDHE算法

DHE算法由于性能不佳，需要大量的乘法，为了提升性能，就出现了ECDHE算法。



ECDHE算法是在DHE算法的基础上利用了ECC椭圆曲线特性，可以用更少的计算量计算出公钥，以及最终的会话密钥。



过程如下：

1. 客户端和服务端确定好使用哪种椭圆曲线和曲线上的基点G，两个参数是公开的

2. 客户端和服务端各自随机生成一个随机数作为私钥d，并与基点G相乘得到公钥Q（Q = dG），此时客户端和服务端的公私钥分别是
   
   > 客户端： Q1和d1 
   > 
   > 服务端： Q2和d2
   
   

3. 双方交换各自的公钥，最后客户端计算点(x1, y1) = d1Q2, 服务端计算点（x2,y2）= d2Q1，由于椭圆曲线上是可以满足乘法交换和结合率，所以：
   
   > d1Q2 = d1d2G = d2d1G = d2Q1
   
   因此双方的x坐标是一样的，所以它是共享密钥，也就是会话密钥。



这个过程中，双方的私钥都是随机的、临时生成的，都是不公开的，即使根据公开的信息（椭圆曲线、公钥、基点G）也是很难计算出椭圆曲线上的离散对数（私钥）。





---

参考：

[图解 ECDHE 密钥交换算法 - 小林coding - 博客园](https://www.cnblogs.com/xiaolincoding/p/14318338.html)

[HTTPS详解](https://mp.weixin.qq.com/s/sYuvL9ucjyaUIhwkHllSsg)

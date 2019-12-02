# dns

标签（空格分隔）： node.js

---

node.js核心模块中有dns模块，用于DNS解析

引用：
```js
const dns = require('dns')
```

### API

lookup
```js
// lookup两个方法不需要网络交互，直接读取本机
dns.lookup(hostname, [,options], callback)
dns.lookupService(address, port, callback)
```

```js
// 以下方法需要网络交互，每种方法的含义参考：https://www.zybuluo.com/DillonLiang/note/1476916
dns.resolve4(hostname, [,options], callback)
dns.resolve6(hostname, [,options], callback)
dns.resolveCname(hostname, callback)
dns.resolveMx(hostname, callback)
dns.resolveNaptr(hostname, callback)
dns.resolveNs(hostname, callback)
dns.resolvePtr(hostname, callback)
dns.resolveSoa(hostname, callback)
dns.resolveTxt(hostname, callback)
```

dns模块里也有2个特殊的方法：
```js
dns.resolve(hostname, rrtype, callback)
dns.resolveAny(hostname, callback)
```

**resolve方法可以指定rrtype来获取dns记录，rrtype支持的类型有：A, AAAA, ANY, CNAME, MX, NAPTR, NS, PTR, SOA, SRV, TXT
resolveAny返回所有记录，**

dns模块也可以根据ip地址
```js
dns.reverse(ip, callback)
```

在最新的node.js版本里，已经支持promise。

--- 
文档：https://nodejs.org/dist/latest-v12.x/docs/api/dns.html#dns_dns
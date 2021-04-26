## 获取用户真实IP

```
kubectl -n kube-system edit cm nginx-configuration
```



添加内容：

```yaml
compute-full-forwarded-for: "true"
forwarded-for-header: "X-Forwarded-For"
use-forwarded-headers: "true"
```

保存后立即生效。

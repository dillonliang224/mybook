

### dashboard

获取token

```bash
kubectl get secrets -n kube-system
```

找一个**replicaset-controller-token**开头的复制下来

然后执行

```bash
kubectl -n kube-system describe secrets replicaset-controller-token-6gfj2
```

会有一个token标示，拷贝一下，



打开dashboard

```bash
kubectl proxy
```

然后点击如下链接：

[http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login](https://links.jianshu.com/go?to=http%3A%2F%2Flocalhost%3A8001%2Fapi%2Fv1%2Fnamespaces%2Fkubernetes-dashboard%2Fservices%2Fhttps%3Akubernetes-dashboard%3A%2Fproxy%2F%23%2Flogin)



选择token的方式登陆，并填上刚拷贝的token即可。

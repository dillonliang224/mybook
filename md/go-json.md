# JSON序列化和反序列化

在golang中，json的序列化和反序列化用到的是**encoding/json**包，提供了一系列相关的方法用于处理json。

## 自定义Go Json的序列化方法

参考： [[译]自定义Go Json的序列化方法 | 鸟窝](https://colobu.com/2020/03/19/Custom-JSON-Marshalling-in-Go/)

如果你为类型实现了`MarshalJSON() ([]byte, error)`和`UnmarshalJSON(b []byte) error`方法，那么这个类型在序列化反序列化时将采用你定制的方法。

临时为一个struct增加一个字段，可以考虑采用如下的方式。

```go
package main

import (
    "encoding/json"
    "os"
    "time"
)

type MyUser struct {
    ID       int64     `json:"id"`
    Name     string    `json:"name"`
    LastSeen time.Time `json:"lastSeen"`
}

func (u *MyUser) MarshalJSON() ([]byte, error) {
    type Alias MyUser
    return json.Marshal(&struct {
        LastSeen int64 `json:"lastSeen"`
        *Alias
    }{
        Alias:    (*Alias)(u),
        LastSeen: u.LastSeen.Unix(),
    })
}

func (u *MyUser) UnmarshalJSON(data []byte) error {
    type Alias MyUser

    aux := &struct {
        LastSeen int64 `json:"lastSeen"`
        *Alias
    }{
        Alias: (*Alias)(u),
    }

    if err := json.Unmarshal(data, &aux); err != nil {
        return err
    }

    u.LastSeen = time.Unix(aux.LastSeen, 0)
    return nil
}

// https://colobu.com/2020/03/19/Custom-JSON-Marshalling-in-Go/
// 自定义json序列化方法
func main() {
    _ = json.NewEncoder(os.Stdout).Encode(&MyUser{
        1, "dillon", time.Now(),
    })
}
```

---

参考：

1. [JSON and Go - The Go Blog](https://blog.golang.org/json)

2. [json - The Go Programming Language](https://golang.org/pkg/encoding/json/#Marshal)

3. [[译]自定义Go Json的序列化方法 | 鸟窝](https://colobu.com/2020/03/19/Custom-JSON-Marshalling-in-Go/)

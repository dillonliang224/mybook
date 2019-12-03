# mac上常用命令


## split，将大文件分割为多个小文件

mac上的split命令和linux上的略有不同，不能指定切割文件的后缀格式，只能是字符串

```sh
split [-a suffix_length] [-b byte_count[k|m]] [-l line_count] [-p pattern] [file [name]]
```

如下命令会把account-balance.csv文件按照每80万行记录切割为一个文件，文件名前缀是**account-balance-** eg:
```sh
split -l 800000 account-balance.csv account-balance-
```

在golang里，通过mongodb获取数据时（FindOne），需要注意文档不存在的情况

当使用FindOne方法的时候，如果有值，则返回该值，如果没值，golang里会报一个ErrNoDocuments的错误。

```go
var ErrNoDocuments = errors.New("mongo: no documents in result")
```

如果开发人员不认为这是一个错误，如果没有找到，返回一个nil就好了，那么怎么做呢？

Demo：

```go
func (dao *Dao) FindBookInfo(ctx context.Context, bookId primitive.ObjectID) (*model.Book, error) {
    query := bson.M{
        "_id": bookId,
    }

    var book model.Book
    if err := dao.book.FindOne(&book, query); err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, nil
        }
        return nil, err
    }

    return &book, nil
}
```

当通过FineOne返回一个错误的时候，判断一下这个错误是否是**ErrNoDocuments**错误

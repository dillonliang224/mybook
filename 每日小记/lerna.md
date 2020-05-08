## lerna大仓管理

![lerna](https://cloud.githubusercontent.com/assets/952783/15271604/6da94f96-1a06-11e6-8b04-dc3171f79a90.png)

> A tool for managing JavaScript projects with multiple packages.

用于管理多个js代码库工具🔧。


## 命令

### lerna init

初始化项目库，详情：https://github.com/lerna/lerna/tree/master/commands/init#readme

> lerna init --independent --exact

--independent: 指定为独立模式
--exact: 指定lerna在package的版本号（没有^标志）

### lerna create

新建一个package，交互式指定参数，如果有--yes标志，直接使用默认值，跳过交互，详情：https://github.com/lerna/lerna/tree/master/commands/create#readme
> lerna create <name> [loc]

<name>: package名，本地唯一且可公开引用
loc: 生成package的位置，默认是所配置package的第一个值。


### lerna add

添加一个包的版本为各个包的依赖，详情：https://github.com/lerna/lerna/tree/master/commands/add#readme
> lerna add <package>[@version] [--dev] [--exact]

安装本地或npm仓库里的包到当前lerna项目的各个package下，注意的是，和npm,yarn相比，lerna add一次只能安装一个package。
```sh
# Adds the module-1 package to the packages in the 'prefix-' prefixed folders
lerna add module-1 packages/prefix-*

# Install module-1 to module-2
lerna add module-1 --scope=module-2

# Install module-1 to module-2 in devDependencies
lerna add module-1 --scope=module-2 --dev

# Install module-1 in all modules except module-1
lerna add module-1

# Install babel-core in all modules
lerna add babel-core
```

### lerna list

列举当前lerna 库包含的包

### lerna publish

发布新的库版本

### lerna version

修改package版本，做了如下工作：
- 识别出修改的包
- 生成新的版本号
- 修改package.json文件
- 提交以上更改并打tag
- 推送到git上

### lerna bootstrap

bootstrap作了如下工作

- 为每个包安装依赖
- 链接相互依赖的库到具体的目录
- 执行 npm run prepublish
- 执行 npm run prepare


### lerna changed

### lerna diff

### lerna clean

删除各个包下的node_modules，不会删除根目录下的node_modules，即使指定了--host选项。






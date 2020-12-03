# Quick-generate-cli

通过ng-component-generator-cli可以快速生成angular组件文件包

## 版本说明

### 1.0.0

+ 快速创建angular组件文件包


## 使用方法
### 全局安装
```bash
npm install -g ng-component-generator-cli
```
检测是否安装成功
```bash
qg -v
```
在page目录下创建一个angular组件
```bash
qg -g path/component-name
```

## 说明:
1. 文件夹与组件同名，默认创建在项目根目录下, 可以在前面增加路径名来到达目标目录， 如 `qg -g no/exist/path/component-name`。
2. 默认读取 `$/config/css-config.json`中的language字段来定义css文件后缀






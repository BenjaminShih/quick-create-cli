# Quick-generate-cli

通过Quick-generate-cli可以快速生成angular组件文件包

## 版本说明

### 0.0.1-Beta.0

+ 快速创建angular组件文件包， 基于 https://github.com/tbhuabi/quick-start-cli 谭大师脚手架创建的angular项目


## 使用方法
### 全局安装
```bash
npm install -g quick-generate-cli
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
1. 文件夹与组件同名，默认创建在`$/src/pages`文件目录下, 可以在前面增加路径名来到达目标目录， 如 `qg -g no/exist/path/component-name`。
2. 默认读取 `$/config/css-config.json`中的language字段来定义css文件后缀,如果项目采用quick-start-cli脚手架建立，那么自动会生成该配置文件。






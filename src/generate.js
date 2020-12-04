const path = require('path');
// 意为"粉笔"，修改控制台中字符串的样式（字体样式加粗等／字体颜色／背景颜色）
// exp: console.log(chalk.red.bold.bgWhite('Hello World'));
const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
// 与命令行交互的工具
const inquirer = require('inquirer');

const line = require('./line');
const log = require('./logger');
const cssConfig = require(path.join(process.cwd(), 'config/css-config.json'));

const cssSuffixMap = {
  less: 'less',
  sass: 'scss',
  stylus: 'styl',
};

// 中划线命名转化成大驼峰 2
const camelize = (str) => {
  const camel = (str + '').replace(/-\D/g, (match) => {
    return match.charAt(1).toUpperCase();
  });
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

// 将首字母小写
const lowercaseFirstLetter = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

module.exports = function (pathName) {
  line();
  // 取最后的/后面的字符串为组件名
  const componentName = pathName.substring(pathName.lastIndexOf('/') + 1);
  // 测试是否是合法组件名
  if (!/^[a-zA-Z_][-_\w$]*$/.test(componentName)) {
    log(chalk.red('组件名不合法，请参考变量命名规则！'));
    return;
  }
  log(chalk.green('正在创建 ' + componentName + ' 组件……'));
  // css预编译器选择
  const cssSuffix = cssSuffixMap[cssConfig.language];
  // 需要构建的文件后缀
  const filesDecorations = [
    '.component.html',
    '.component.ts',
    '.component.' + cssSuffix,
    '.service.ts',
  ];

  // 新建文件夹位置，暂定为根目录
  const folderPath = path.join(process.cwd(), pathName + '/');
  mkdirp.sync(folderPath, (error) => {
    if (error) {
      log(chalk.red(error));
    }
  });

  // 文件构建函数
  const genetate = function () {
    const filesDecoration = filesDecorations.shift();
    // 构造文件地址
    const file = path.join(folderPath + componentName + filesDecoration);

    let fileContent = '';
    let className = '';

    // 测试文件是否存在
    fs.access(file, fs.constants.F_OK, (err) => {
      // 文件构建函数
      const create = () => {
        if (filesDecoration === '.component.ts') {
          className = camelize(componentName) + 'Component';
          const serviceName = camelize(componentName) + 'Service';
          fileContent = `import { Component } from '@angular/core';
            
import { ${serviceName} } from './${componentName}.service';

@Component({
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.${cssSuffix}'],
  providers: [
    ${serviceName}
  ]
})

export class ${className} {
  constructor(private ${lowercaseFirstLetter(serviceName)}: ${serviceName}) {
  }
}`;
        }

        if (filesDecoration === '.service.ts') {
          className = camelize(componentName) + 'Service';
          fileContent = `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ${className} {
  constructor(private http: HttpClient) {
  }
}`;
        }

        fs.writeFileSync(file, fileContent, (error) => {
          if (error) {
            log(chalk.red(error));
          }
        });

        log(chalk.green(file + ' 文件创建完成！'));
      };

      if (err) {
        create();
        // 递归直到要创建的后缀数组为空
        if (filesDecorations.length) {
          genetate();
        }
      } else {
        // 若文件存在则询问是否覆盖
        inquirer
          .prompt([
            {
              message: file + ' 文件已经存在，是否覆盖？',
              name: 'confirm',
              type: 'confirm',
            },
          ])
          .then((result) => {
            if (result.confirm) {
              create();
            } else {
              log(chalk.red(file + ' 文件创建已取消'));
            }
            if (filesDecorations.length) {
              genetate();
            }
          });
      }
    });
  };

  genetate();
};

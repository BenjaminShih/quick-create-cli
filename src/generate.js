const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');


const line = require('./line');
const log = require('./logger');
const cssConfig = require(path.join(process.cwd(), 'config/css-config.json'));

const cssSuffixMap = {
  sass: 'scss',
  stylus: 'styl',
  less: 'less',
};

const camelize = (str) => {
  const camel = (str + "").replace(/-\D/g,
    (match) => {
      return match.charAt(1).toUpperCase();
    });
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const lowercaseFirstLetter = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};


module.exports = function (pathName) {
  line();
  const componentName = pathName.substring(pathName.lastIndexOf('/') + 1);
  if (!/^[a-zA-Z_][-_\w$]*$/.test(componentName)) {
    log(chalk.red('组件名不合法，请参考变量命名规则！'));
    return;
  }
  log(chalk.green('正在创建' + componentName + '组件……'));

  const cssSuffix = cssSuffixMap[cssConfig.language];
  const filesDecorations = ['.component.html', '.component.ts', '.component.' + cssSuffix, '.service.ts'];

  const folderPath = path.join(process.cwd(), 'src/pages/' + pathName + '/');

  mkdirp.sync(folderPath, (error) => {
    if (error) {
      log(chalk.red(error));
    }
  });

  const genetate = function () {
    const filesDecoration = filesDecorations.shift();
    const file = path.join(process.cwd(), 'src/pages/' + pathName + '/' + componentName + filesDecoration);

    let fileContent = '';
    let className = '';

    fs.access(file, fs.constants.F_OK, (err) => {
      const create = () => {
        if (filesDecoration === '.component.ts') {
          className = camelize(componentName) + 'Component';
          const serviceName = camelize(componentName) + 'Service';
          fileContent =
            `import { Component } from '@angular/core';
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
          fileContent =
            `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ${className} {
  constructor(private http: HttpClient) {
  }
}`

        }

        fs.writeFileSync(file, fileContent, error => {
          if (error) {
            log(chalk.red(error));

          }
        });

        log(chalk.green(file + ' 文件创建完成！'));
      };

      if (err) {
        create();
        if (filesDecorations.length) {
          genetate();
        }
      } else {
        inquirer.prompt([{
          name: 'confirm',
          type: 'confirm',
          message: file + ' 文件已经存在，是否覆盖？',
        }]).then((result) => {
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
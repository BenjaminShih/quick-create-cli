const copy = require('directory-copy');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const mkdirp = require('mkdirp');

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


module.exports = function (pathName) {
  line();
  const componentName = pathName.substring(pathName.lastIndexOf('/') + 1);
  if (!/^[a-zA-Z][_\w$]*$/.test(componentName)) {
    log(chalk.red('组件名不合法，请参考变量命名规则！'));
    return;
  }
  log(chalk.green('正在创建' + componentName + '组件……'));

  const cssSuffix = cssSuffixMap[cssConfig.language];
  const filesDecorations = ['.component.html', '.component.ts', '.component.' + cssSuffix, '.service.ts'];

  const filePath = path.join(process.cwd(), 'src/pages/' + pathName);
  const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));

  mkdirp.sync(folderPath, (error) => {
    if (error) {
      log(chalk.red(error));
    }
  });

  filesDecorations.forEach((filesDecoration, index) => {
    const file = path.join(process.cwd(), 'src/pages/' + pathName + filesDecoration);
    let fileContent = '';
    let className = '';


    if (filesDecoration === '.component.ts') {
      className = camelize(componentName) + 'Component';
      fileContent =
        `import { Component } from '@angular/core';
      
@Component({
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}${filesDecorations[2]}']
})
export class ${className} {
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
  });
  log(chalk.green(componentName + '组件创建创建完成！'));
};
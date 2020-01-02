#!/usr/bin/env node

/**
 * Module dependencies.
 */
const program = require('commander');

const packageJson = require('../package.json');
const generate = require('../src/generate');

program
  .version(packageJson.version)
  .option('-g, --generate <pathName>' ,'through quick-generate-cli create A component', (pathName) => {
    generate(pathName);
  })
  .parse(process.argv);
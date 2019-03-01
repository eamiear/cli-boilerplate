#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const program = require('commander')
const init = require('../src/commands/init')
const createApp = require('../src/commands/module')

program
  .version('0.0.1')
  .command('init')
  .description(`This utility will walk you through creating a tti.config.js file.`)
  .action(init);

program
  .command('create')
  // .arguments('<template> <app-name>')  
  // .option('-n, --name', 'project name')
  .description('create a new project')
  .action(createApp);

// if (!(program.args && program.args.length)) program.help()

program.parse(process.argv)
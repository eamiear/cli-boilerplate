const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')

function copyTtiConfigJS () {
  figlet('tti cli', {horizontalLayout: 'full'}, (err, data) => {
    if (err) {
      console.log(chalk.red('Something get wrong in figlet'))
    }
    console.log(chalk.yellow(data))
    let targetFilePath = path.resolve('tti.config.js')
    let templatePath = path.join(__dirname, '../tti/tti.config.js')
    let contents = fs.readFileSync(templatePath, 'utf8')
    fs.writeFileSync(targetFilePath, contents, 'utf8')
    console.log(chalk.green('Initialize tti config file success\n'))
    process.exit(0)
  })
}

module.exports = () => {
  if (fs.existsSync(path.resolve('tti.config.js'))) {
    inquirer.prompt([{
      name: 'init-config-file',
      type: 'confirm',
      message: 'tti.config.js is already existed, are you sure to overwrite?',
      validate (input) {
        if (input.lowerCase !== 'y' && input.lowerCase !== 'n') {
          return 'Please input y/n !'
        } else {
          return true
        }
      }
    }]).then(answers => {
      if (answers['init-config-file']) {
        copyTtiConfigJS()
      } else {
        process.exit(0)
      }
    }).catch(err => {
      console.log(chalk.red(err))
    })
  } else {
    copyTtiConfigJS()
  }
}
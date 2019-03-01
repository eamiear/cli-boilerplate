const inquirer = require('inquirer')
const fs = require('fs')
const chalk = require('chalk')

module.exports = () => {
  const CHOICES = fs.readdirSync(`${process.cwd()}/src/templates`)

  const QUESTIONS = [
    {
      name: 'app-choice',
      type: 'list',
      message: 'What project template would you like to generate?',
      choices: CHOICES
    },
    {
      name: 'app-name',
      type: 'input',
      message: 'app name:',
      validate: function (input) {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        else return 'Project name may only include letters, numbers, underscores and hashes.'
      }
    }
  ]

  const CURR_DIR = process.cwd()

  function deleteFolderRecursive (path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const currentPath = `${path}/${file}`
        if (fs.lstatSync(currentPath).isDirectory()) {
          deleteFolderRecursive(currentPath)
        } else {
          fs.unlinkSync(currentPath)
        }
      })
      fs.rmdirSync(path)
    }
  }

  function createDirectoryContents (templatePath, newProjectPath) {
    const filesToCreate = fs.readdirSync(templatePath)

    filesToCreate.forEach(file => {
      const origFilePath = `${templatePath}/${file}`
      
      // get stats about the current file
      const stats = fs.statSync(origFilePath)

      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, 'utf8')
        
        const writePath = `${CURR_DIR}/${newProjectPath}/${file}`
        fs.writeFileSync(writePath, contents, 'utf8');
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`)
        
        // recursive call
        createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`)
      }
    })
  }
  inquirer
    .prompt(QUESTIONS)
    .then(answers => {
      const projectChoice = answers['app-choice']
      const projectName = answers['app-name']
      const templatePath = `${process.cwd()}/src/templates/${projectChoice}`
      const targetDir = `${CURR_DIR}/${projectName}`
    
      console.log(`${CURR_DIR}/${projectName}`)
      if (fs.existsSync(targetDir)) {
        inquirer.prompt([
          {
            name: 'app-overwrite',
            type: 'confirm',
            message: `App name ${projectName} is already existed, are you sure to overwrite?`,
            validate (input) {
              if (input.lowerCase !== 'y' && input.lowerCase !== 'n') {
                return 'Please enter y/n'
              } else {
                return true
              }
            }
          }
        ]).then(answers => {
          if (answers['app-overwrite']) {
            deleteFolderRecursive(targetDir)
            console.log(chalk.yellow('removing exsited app'))

            fs.mkdirSync(targetDir)
            createDirectoryContents(templatePath, projectName)
            console.log(chalk.green(`App "${projectName}" create finished`))
          }
        }).catch(err => {
          console.log(chalk.red(err))
        })
      } else {
        fs.mkdirSync(targetDir)
        createDirectoryContents(templatePath, projectName)
      }
    })
}

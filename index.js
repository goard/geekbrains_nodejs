const readline = require('readline')
const fsp = require('fs/promises')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let pathVar = ''

function readDirInquirerChoose(inPath) {
  if (pathVar !== '') {
    pathVar = path.join(pathVar, inPath)
  } else {
    pathVar = inPath
  }
  return new Promise((resolve, reject) => {
    fsp
      .readdir(pathVar)
      .then((choices) => {
        return inquirer.prompt({
          name: 'fileName',
          type: 'list', // input, number, confirm, list, rawlist, expand, checkbox, password
          message: 'Choose file',
          choices,
        })
      })
      .then(async ({ fileName }) => {
        const stat = await fsp.stat(path.join(pathVar, fileName))
        if (stat.isDirectory()) {
          return await readDirInquirerChoose(fileName)
        }
        return fileName
      })
      .then(resolve)
      .catch(reject)
  })
}

rl.question('Please enter the path to the file:', (inPath) => {
  readDirInquirerChoose(inPath)
    .then((res) => {
      inquirer
        .prompt({
          name: 'search',
          type: 'input',
          message: 'Please enter the string for search',
        })
        .then(({ search }) => {
          const regexp = new RegExp(search, 'g')
          fs.readFile(path.join(pathVar, res), 'utf-8', (err, data) => {
            let matchAll = data.matchAll(regexp)
            matchAll = Array.from(matchAll)
            console.log('matchAll', matchAll)
            if (matchAll.length !== 0) {
              for (let item of matchAll[0]) {
                console.log(item)
              }
            } else {
              console.log('Not match to file')
            }
            rl.close()
          })
        })
    })
    .catch((error) => console.error(`Error: ${error}`))
})

rl.on('close', () => process.exit(0))

const http = require('http')
const path = require('path')
const fsp = require('fs/promises')
const inquirer = require('inquirer')

const host = 'localhost'
const port = 3000
const resDir = __dirname

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
const server = http.createServer(async (req, res) => {
  let data =null
  data  = await readDirInquirerChoose(resDir)

  if(data) {
    res.end(JSON.stringify(data))
  }
  res.end(JSON.stringify(resDir))
})


server.listen(port, host, () =>
  console.log(`Server run at http://${host}:${port}`)
)

const http = require('http')
const path = require('path')
const fsp = require('fs/promises')
const fs = require('fs')

const host = 'localhost'
const port = 3000
const resDir = __dirname

let inPath = resDir
let link = ''

async function checkIsDir(inPath) {
  const stat = await fsp.stat(inPath)
  return stat.isDirectory()
}

function readDirInquirerChoose(inPath) {
  return new Promise(async (resolve, reject) => {
    await fsp.readdir(inPath).then(resolve).catch(reject)
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (req.url != '/favicon.ico') {
    const url = req.url.substring(1, req.url.length)

    if (url !== '') {
      inPath += `/${url}`
      link += `/${url}`
      const isDirectory = await checkIsDir(inPath)
      if (isDirectory) {
        readDirInquirerChoose(inPath).then((data) => {
          arr = data.map((el) => `<li><a href="${el}">${el}</a></li>`).join(' ')
          res.end(arr)
        })
      } else {
        const readStream = fs.createReadStream(inPath, { encoding: 'utf-8' })

        readStream.on('data', (chunk) => {
          res.write(chunk)
        })

        readStream.on('end', () => {
          res.end()
        })
      }
    } else {
      inPath = resDir
      readDirInquirerChoose(resDir).then((data) => {
        arr = data.map((el) => `<li><a href="${el}">${el}</a></li>`).join(' ')
        res.end(arr)
      })
    }
  }
})

server.listen(port, host, () =>
  console.log(`Server run at http://${host}:${port}`)
)

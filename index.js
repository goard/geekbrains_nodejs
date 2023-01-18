const { createReadStream, createWriteStream } = require('fs')
const { createInterface } = require('readline')

const ipAddress1 = '89.123.1.41'
const ipAddress2 = '34.48.240.111'

const rs = createReadStream('./access_tmp.log')
const ws1 = createWriteStream(`./${ipAddress1}_requests.log`)
const ws2 = createWriteStream(`./${ipAddress2}_requests.log`)

const rl = new createInterface({
  input: rs,
})

rl.on('line', function (line) {
  if (new RegExp(ipAddress1, 'i').test(line)) {
    ws1.write(line + '\n')
  } else if (new RegExp(ipAddress2, 'i').test(line)) {
    ws2.write(line + '\n')
  }
})

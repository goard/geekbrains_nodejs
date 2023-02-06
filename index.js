const http = require('http')
const { Server } = require('socket.io')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const host = 'localhost'
const port = 3000

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), './index.html')
    const rs = fs.createReadStream(filePath)

    rs.pipe(res)
  }
})
const io = new Server(server)

io.on('connection', (client) => {
  console.log(`Websocket connetcted ${client.id}`)
  const userId = crypto.randomUUID()

  client.on('disconnect', (reason) => {
    console.log('reason', reason)
  })
  client.emit('connect-user', { userId })

  client.on('client-msg', (data) => {
    client.broadcast.emit('server-msg', { userId: data.userId, msg: data.msg })
    client.emit('server-msg', { userId: data.userId, msg: data.msg })
  })
})

server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
)

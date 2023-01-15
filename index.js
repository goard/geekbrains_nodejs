const moment = require('moment')
const EventEmitter = require('events')
const args = process.argv.slice(2)

const emitter = new (class extends EventEmitter {})()

emitter.on('timer', (items) => {
  for (const item of items) {
    timer(item)
  }
})

emitter.emit('timer', args)

function timer(date) {
  const momentValue = moment(date, 'HH-DD-MM-YYYY')

  setInterval(function () {
    const result = momentValue.diff(moment())
    if (moment().isAfter(momentValue)) {
      clearInterval(this)
      console.log('Time is up!')
      return
    }
    const duration = moment.duration(result)
    console.log(
      duration.days(),
      'days',
      duration.hours(),
      'hours',
      duration.minutes(),
      'minutes',
      duration.seconds(),
      'seconds',
      'left'
    )
  }, 1000)
}

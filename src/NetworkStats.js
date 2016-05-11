var fs = require('fs')

var ns = require('./NetworkTool.js')

function NetworkStats (ip, mask) {
  var self = this
  this.network = ip
  this.mask = mask
  this.interval = null
  this.data = null
  fs.readFile(__dirname + '/db-' + this.network + '.json', function (err, file) {
    if (err) console.log(err)

    self.data = JSON.pars(file)
  })
}

NetworkStats.prototype.start = function () {
  this.interval = setInterval(this.scan, 1000)
}

NetworkStats.prototype.stop = function () {
  clearInterval(this.interval)
}

NetworkStats.prototype.save = function(){
  var self = this
  fs.writeFile(__dirname + '/db.json', JSON.stringify(self.data, null, 2), function (err) {
    if (err) console.log(err)
  })
}

NetworkStats.prototype.scan = function () {
  var self = this
  ns(this.network, this.mask, function (data) {
    for (var key in data) {
      var device = data[key]
      if (typeof self.data[device.mac] === 'undefined') {
        self.data[device.mac] = { name: 'none', ip: {} }
      }
      if (typeof self.data[device.mac].ip === 'undefined') {
        self.data[device.mac] = {}
      }
      if (typeof self.data[device.mac].ip[device.ip] === 'undefined') {
        self.data[device.mac].ip[device.ip] = []
      }
      self.data[device.mac].ip[device.ip].push((new Date()).getTime())
    }
  })
}

module.exports = NetworkStats

var fs = require('fs')
var os = require('os')
var nc = require('network-calculator')

var ns = require('./NetworkTool.js')

var ips = getAllInterfaces()
for (key in ips) {
  setInterval(function () {
    console.log('Scan: '+ nc(ips[key][0], ips[key][1]).network)

    startScan(ips[key][0], ips[key][1])
  }, 600000)
}

function startScan (network, mask) {
  ns(network, mask, function (data) {
    fs.readFile(__dirname + '/db.json', function (err, file) {
      if (err) console.log(err)

      stats = JSON.parse(file)

      for (var key in data) {
        var device = data[key]
        if (typeof stats[device.mac] === 'undefined') {
          stats[device.mac] = { name: 'none', ip: {} }
        }
        if (typeof stats[device.mac].ip === 'undefined') {
          stats[device.mac] = {}
        }
        if (typeof stats[device.mac].ip[device.ip] === 'undefined') {
          stats[device.mac].ip[device.ip] = []
        }
        stats[device.mac].ip[device.ip].push((new Date()).getTime())
        stats[device.mac].ip[device.ip].slice(stats[device.mac].ip[device.ip].length - 1024)
      }
      fs.writeFile(__dirname + '/db.json', JSON.stringify(stats), function (err) {
        if (err) console.log(err)
      })
    })
  })
}

function getAllInterfaces () {
  var interfaces = os.networkInterfaces()
  var addresses = []
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2]
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push([address.address, address.netmask])
      }
    }
  }
  return addresses
}

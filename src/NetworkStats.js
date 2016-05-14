var fs = require('fs')
var os = require('os')
var nc = require('network-calculator')
var dns = require('dns')

var ns = require('./NetworkTool.js')

var STATS = {}

fs.readFile(__dirname + '/db.json', function (err, file) {
  if (err) console.log(err)

  STATS = JSON.parse(file)
})
var ips = getAllInterfaces()
for (key in ips) {
  setInterval(function () {
    console.log('Scan: '+ nc(ips[key][0], ips[key][1]).network)

    startScan(ips[key][0], ips[key][1])
  }, 300000)

  setInterval(function () {
    fs.writeFile(__dirname + '/db.json', JSON.stringify(STATS), function (err) {
      if (err) console.log(err)
    })
  }, 1000)
}

function startScan (network, mask) {
  ns(network, mask, function (data) {
    data.forEach(function (device, index) {
      dns.lookupService(device.ip, '80', function (err, hostname) {
        if (typeof STATS[device.mac] === 'undefined') {
          STATS[device.mac] = { name: hostname, ip: {} }
        }
        if (typeof STATS[device.mac].ip === 'undefined') {
          STATS[device.mac] = {}
        }
        if (typeof STATS[device.mac].ip[device.ip] === 'undefined') {
          STATS[device.mac].ip[device.ip] = []
        }
        STATS[device.mac].ip[device.ip].push((new Date()).getTime())
        STATS[device.mac].ip[device.ip].slice(STATS[device.mac].ip[device.ip].length - 1024)
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

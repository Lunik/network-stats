var arp = require('node-arp')
var nc = require('network-calculator')
var as = require('async')

function NetworkStats (network, mask, cb) {
  applyAllIp(network, mask, get_arp, cb)
}

function get_arp (ip, cb) {
  var regexIp = /[0-9.]+/
  arp.getMAC(ip, function (err, mac) {
    if (regexIp.test(mac)) {
      cb(err, {ip: ip, mac: mac})
    } else {
      cb(err, null)
    }
  })
}

function applyAllIp (network, mask, fct, cb) {
  var networkInfo = nc(network, mask)
  var ip = networkInfo.firsthost.split('.')

  var ips = []
  while(ip.join('.') !== networkInfo.lasthost){
    ips.push(ip.join('.'))

    if (ip[3]++ > 256) {
      ip[3] = 0
      if (ip[2]++ > 256) {
        ip[2] = 0
        if (ip[1]++ > 256) {
          ip[1] = 0
          if (ip[0]++ > 256) {
            ip[0] = 0
          }
        }
      }
    }
  }
  as.map(ips, get_arp, function (err, results) {
    cb(results.filter(function (element) {
      return element !== null
    }))
  })
}

module.exports = NetworkStats

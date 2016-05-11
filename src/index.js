var fs = require('fs')

var ns = require('./NetworkStats.js')

ns('192.168.1.0', '255.255.255.0', function(data){
  fs.readFile(__dirname+'/db.json', function(err, file){
    if(err) console.log(err)

    file = JSON.parse(file)
    for(var key in data){
      var device = data[key]
      if(typeof file[device.mac] === 'undefined'){
        file[device.mac] = { name: "none", ip: {} }
      }
      if(typeof file[device.mac].ip === 'undefined'){
        file[device.mac] = {}
      }
      if(typeof file[device.mac].ip[device.ip] === 'undefined'){
        file[device.mac].ip[device.ip] = []
      }
      file[device.mac].ip[device.ip].push((new Date()).getTime())
    }
    fs.writeFile(__dirname+'/db.json', JSON.stringify(file, null, 2), function(err){
      if(err) console.log(err)
    })
  })
})

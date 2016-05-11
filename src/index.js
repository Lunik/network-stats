var fs = require('fs')

var ns = require('./NetworkStats.js')

ns('192.168.1.0', '255.255.255.0', function(data){
  fs.readFile(__dirname+'/db.json', function(err, file){
    file = JSON.parse(file)
    for(var key in data){
      var device = data[key]
      if(typeof file[device.mac] === 'undefined')
      file[device.mac][device.ip].push(new Date())
    }
    console.log(file)
  })
})

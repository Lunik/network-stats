var express = require('express')
var compression = require('compression')
var http = require('http')
var fs = require('fs')

http.globalAgent.maxSockets = Infinity

app = express()
app.use(compression())
app.use(express.static(__dirname+"/public"))

server = http.createServer(app)
var port = process.env.PORT || 5000
server.listen(port, function () {
    console.log('Server listening at port ' + port)
})

app.get('/db.json', function(req, res){
  fs.readFile(__dirname+"/db.json", function (err, data) {
    if (err) console.log(err)

    res.end(data)
  })
})

app.get('/jquery.js', function(req, res){
  fs.readFile(__dirname+"/../node_modules/jquery/dist/jquery.min.js", function (err, data) {
    if (err) console.log(err)

    res.end(data)
  })
})

app.get('/chart.js', function(req, res){
  fs.readFile(__dirname+"/../node_modules/chart.js/dist/chart.min.js", function (err, data) {
    if (err) console.log(err)

    res.end(data)
  })
})

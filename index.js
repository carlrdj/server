const history = require('connect-history-api-fallback')
const express = require('express')
const https= require('https')
const http= require('http')
const fs= require('fs')
const app = express()
var serveStatic = require('serve-static')
app.use(history({
	verbose: true
}))
app.use(serveStatic(__dirname))

app.use('/src/assets', express.static(__dirname + '/src/assets'))

var port = process.env.PORT || 80

const credentials = {
  key: fs.readFileSync('./cert/gamarraya.key', 'utf8'),
  cert: fs.readFileSync('./cert/670cb8308ec29972.crt', 'utf8'),
  equestCert: true,
  ca: fs.readFileSync('./cert/gd_bundle-g2-g1.crt', 'utf8')
};

const httpServer = http.createServer(function(req, res) {
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
}, app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

const server = httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

const io = require('socket.io')(server);

io.on('connection', function(socket) {
  socket.on('CONNECTION', function(data) {
    io.emit('CONNECT', socket.id)
  });
  socket.on('SEND_MESSAGE', function(data) {
      io.emit('MESSAGE', data)
  });
});

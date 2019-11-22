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

app.use('/*', express.static(__dirname + '/*'))
try {
  const credentials = {
    key: fs.readFileSync('./../gamarraya-key/gamarraya.key', 'utf8'),
    cert: fs.readFileSync('./../gamarraya-key/670cb8308ec29972.crt', 'utf8'),
    equestCert: true,
    ca: fs.readFileSync('./../gamarraya-key/gd_bundle-g2-g1.crt', 'utf8')
  };  
  
  const httpsServer = https.createServer(credentials, app);
} catch (error) {
  console.log('Falta CRT');  
}

const httpServer = http.createServer(function(req, res) {
  res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
  res.end();
}, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

try {
  const server = httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
  
} catch (error) {
  console.log('Falta CRT');
  
}


const express = require('express')
const path = require('path')
const port = process.env.PORT || 80
const app = express()

// serve static assets normally
app.use(express.static(__dirname + '/public'))

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response){
  response.download(path.resolve(__dirname, 'public', 'wZWH_juLpGqPLfaD0gZ3NhbJyZxBJh04Ga-OlaiPZpg'))
})

app.listen(port)
console.log("server started on port " + port)
var express = require('express'),
    potholes = require('./routes/potholes');
 
var app = express();
 
app.get('/potholes', potholes.findAll);
app.get('/potholes/:id', potholes.findById);
 
app.listen(3000);
console.log('Listening on port 3000...');
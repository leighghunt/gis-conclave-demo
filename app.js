var express = require('express'),
    pothole = require('./routes/potholes');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/potholes', pothole.findAll);
app.get('/potholes/:id', pothole.findById);
app.post('/potholes', pothole.addPothole);
app.put('/potholes/:id', pothole.updatePothole);
app.delete('/potholes/:id', pothole.deletePothole);
 
app.listen(3000);
console.log('Listening on port 3000...');
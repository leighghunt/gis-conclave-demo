var express = require('express'),
    path = require('path'),
    http = require('http'),
    pothole = require('./routes/potholes');
 
var app = express();
 
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});
 
app.get('/potholes', pothole.findAll);
app.get('/potholes/:id', pothole.findById);
app.post('/potholes', pothole.addPothole);
app.put('/potholes/:id', pothole.updatePothole);
app.delete('/potholes/:id', pothole.deletePothole);
 
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var express = require('express');
 
var app = express();
 
app.get('/potholes', function(req, res) {
    res.send([{name:'pothole1'}, {name:'pothole2'}]);
});
app.get('/potholes/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description", latlng: ""});
});
 
app.listen(3000);
console.log('Listening on port 3000...');
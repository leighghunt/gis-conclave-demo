app.get('/potholes', function(req, res) {
    res.send([{name:'pothole1'}, {name:'pothole2'}, {name:'pothole3'}]);
});
app.get('/potholes/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description", latlng: ""});
});

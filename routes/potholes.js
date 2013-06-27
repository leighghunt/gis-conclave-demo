exports.findAll = function(req, res) {
    res.send([{name:'pothole1'}, {name:'pothole2'}, {name:'pothole3'}]);
};
exports.findById = function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description", latlng: ""});
};

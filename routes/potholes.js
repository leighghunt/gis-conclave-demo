var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('potholedb', server, {safe: true});
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'potholedb' database");
        db.collection('potholes', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'potholes' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving pothole: ' + id);
    db.collection('potholes', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('potholes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addPothole = function(req, res) {
    var pothole = req.body;
    console.log('Adding pothole: ' + JSON.stringify(pothole));
    db.collection('potholes', function(err, collection) {
        collection.insert(pothole, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updatePothole = function(req, res) {
    var id = req.params.id;
    var pothole = req.body;
    delete pothole._id;
    console.log('Updating pothole: ' + id);
    console.log(JSON.stringify(pothole));
    db.collection('potholes', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, pothole, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating pothole: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(pothole);
            }
        });
    });
}
 
exports.deletePothole = function(req, res) {
    var id = req.params.id;
    console.log('Deleting pothole: ' + id);
    db.collection('potholes', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var potholes = [
    {
        name: "A1",
        description: "Manners Street ASB entrance",
        latlng: '{"lat" : -41.290105, "lng" : 174.775593}',
        notes: "Damaged"
    },
    {
        name: "A2",
        description: "Manners Street National Bank entrance",
        latlng: '{"lat" : -41.289579, "lng" : 174.775012}',
        notes: "Covered in slime"
    }];
 
    db.collection('potholes', function(err, collection) {
        collection.insert(potholes, {safe:true}, function(err, result) {});
    });
 
};
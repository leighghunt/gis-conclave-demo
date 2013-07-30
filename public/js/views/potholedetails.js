window.PotholeView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

var model = this.model;
/*
    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/100725/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>[.]',
      maxZoom: 18
    }).addTo(map);
*/

var origin_CommunityBasemap = [-4020900, 19998100];
var origin_GWRCAerials = [-4020900, 19998100];

var resolutions_GWRCAerials = [
               198.437896875794,
               132.291931250529,
                66.1459656252646,
                26.4583862501058,
                13.2291931250529,
                 6.61459656252646,
                 5.29167725002117,
                 3.96875793751588,
                 2.64583862501058,
                 2.11667090000847,
                 1.05833545000423,
                 0.529167725002117,
                 0.264583862501058,
                 0.132291931250529]

var resolutions_CommunityBasemap = [
              4233.341800016934, 
              2116.670900008467, 
              1587.5031750063501, 
              1058.3354500042335,
               793.7515875031751,
               529.1677250021168,
               264.5838625010584, 
               132.2919312505292,
                66.1459656252646,
                33.0729828126323, 
                19.843789687579378, 
                13.229193125052918,
                 5.291677250021167,
                 2.6458386250105836,
                 1.3229193125052918,
                 0.6614596562526459
            ];

var minZoom_CommunityBasemap = 0;
var minZoom_GWRCAerials = 0;
var maxZoom_CommunityBasemap = 15;
var maxZoom_GWRCAerials = 13;

    var crs = new L.Proj.CRS('EPSG:2193',
        '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        {
            origin: origin_GWRCAerials,
            resolutions: resolutions_GWRCAerials
        });

//    var map = L.map(this.$('#map')[0]).setView ([-41.289926, 174.775172], 16);

    var map = new L.Map(this.$('#map')[0], {
        crs: crs,
        scale: function(zoom) {
            return 1 / res[zoom];
        },
        continuousWorld: true,
        worldCopyJump: false
    });

    var tileUrl_CommunityBasemap = 'http://services.arcgisonline.co.nz/arcgis/rest/services/Generic/newzealand/MapServer/tile/{z}/{y}/{x}';
    var tileUrl_GWRCAerials = 'http://mapping.gw.govt.nz/ArcGIS/rest/services/aerial_basemap3/MapServer/tile/{z}/{y}/{x}';
    var attrib_CommunityBasemap = 'Eagle Technology Group Ltd And LINZ &copy; 2012';
    var attrib_GWRCAerials = 'Greater Wellington Regional Council &copy; 2012';

    var tilelayer = new L.TileLayer(tileUrl_GWRCAerials, {
            maxZoom: maxZoom_GWRCAerials,
            minZoom: minZoom_GWRCAerials,
            continuousWorld: true,
            attribution: attrib_GWRCAerials,
	    tileSize: 512,
            tms: false
        });

    map.addLayer(tilelayer);
    map.setView([-41.289926, 174.775172], 8);


    L.Icon.Default.imagePath = '../../lib/leaflet/images';
    if(false && model.has('latlng'))
    {
        var marker = L.marker(model.get("latlng")).addTo(map);
	map.panTo(model.get("latlng"));
    }
//map.locate({setView: true, maxZoom: 8});

    function onMapMouseMove(e) {
    //  console.log("xy: " + e.latlng);
    }

    map.on('mousemove', onMapMouseMove);

function onMapClick(e) {
var marker = L.marker(e.latlng).addTo(map);
    model.set("latlng",  e.latlng);
}


map.on('click', onMapClick);
/*
function onLocationFound(e) {
    var radius = e.accuracy / 2;


    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);
*/



	L.Util.requestAnimFrame(map.invalidateSize,map,!1,map._container);
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deletePothole",
        "drop #picture" : "dropHandler",
	"dragover #picture" : "dragoverHandler"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.savePothole();
        return false;
    },

    savePothole: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('potholes/' + model.id, false);
                utils.showAlert('Success!', 'Pothole saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deletePothole: function () {
        this.model.destroy({
            success: function () {
                alert('Pothole deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    },
    dragoverHandler: function(event) {
        event.preventDefault();
    }

});

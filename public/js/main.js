var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "potholes"	: "list",
        "potholes/page/:page"	: "list",
        "potholes/add"         : "addPothole",
        "potholes/:id"         : "potholeDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var potholeList = new PotholeCollection();
        potholeList.fetch({success: function(){
            $("#content").html(new PotholeListView({model: potholeList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    potholeDetails: function (id) {
        var pothole = new Pothole({_id: id});
        pothole.fetch({success: function(){
            $("#content").html(new PotholeView({model: pothole}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addPothole: function() {
        var pothole = new Pothole();
        $('#content').html(new PotholeView({model: pothole}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'PotholeView', 'PotholeListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
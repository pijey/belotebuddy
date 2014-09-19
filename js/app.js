App = Ember.Application.create();

App.ApplicationSerializer = DS.LSSerializer.extend();
App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'app-emberjs'
});

App.Router.map(function() {
	this.route("index", {path: "/"});
	this.route("partie", {path: "/partie/:partie_id"});
	this.route("parties", {path: "/parties"});
	this.route("donnes", {path: "/donnes/:partie_id"});
	this.route("alldonnes", {path: "/alldonnes"});
});




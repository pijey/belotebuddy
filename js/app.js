App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
	this.route("index", {path: "/"});
	this.route("partie", {path: "/partie"});
	this.route("donnes", {path: "/donnes"});
});

//Routes
App.PartieRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('partie',1);
	}
});

App.DonnesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('donne');
	}
});

App.ApplicationRoute = Ember.Route.extend({
	actions: {
		showModal: function(name, content) {
			var newDonne = this.store.createRecord('donne', {
			});
			this.controllerFor(name).set('content', content);
			this.controllerFor(name).set('model', newDonne);
			this.render(name, {
				into: 'application',
				outlet: 'modal'
			});
		},
		removeModal: function() {
			this.disconnectOutlet({
				outlet: 'modal',
				parentView: 'application'
			});
		}
	}
});

//Views
Ember.RadioButton = Ember.View.extend({  
    tagName : "input",
    type : "radio",
    attributeBindings : [ "name", "type", "value", "checked:checked:" ],
    click : function() {
        this.set("selection", this.$().val())
    },
    checked : function() {
        return this.get("value") == this.get("selection");   
    }.property()
});

//Controllers
App.AjouterDonneModalController = Ember.ObjectController.extend({
	contrats: [80,90,100,110,120,130,140,150,160,170,"Capot"],
	couleurs: ["Coeur","Carreau","Pique","Trèfle","Sans-Atout","Tout-Atout"],
	actions: {
		save: function() {
      		var that = this;
      		this.store.find('partie',1).then(function(parentModel) {
      			that.model.save();
      			parentModel.get("donnes").pushObject(that.model);
      		});
  		}
	}
});

//Models
var attr = DS.attr;
App.Donne = DS.Model.extend({
	attaquant: attr('string'),
	contrat: attr('string'),
	couleur: attr('string'),
	ptsFaitsNS: attr('number'),
	ptsFaitsEO: attr('number'),
	ptsReelsNS: function(){
        return Math.round(this.get("ptsFaitsNS") / 10) * 10;
    }.property("ptsFaitsNS"),
	ptsReelsEO: function(){
        return Math.round(this.get("ptsFaitsEO") / 10) * 10;
    }.property("ptsFaitsEO"),
	ptsMarquesNS: function(){
		var ptsBeloteNS = 0;
		if(this.get("beloteNS")){
			ptsBeloteNS += 20;
		}
		var ptsBeloteEO = 0;
		if(this.get("beloteEO")){
			ptsBeloteEO += 20;
		}
		//NS attaquant
		if(this.get("attaquant") === 'NS'){
			var contrat = 250;
			if(this.get("contrat") !== "Capot"){
				contrat = parseInt(this.get("contrat"));
			}
			
			if(this.get("ptsFaitsNS") + ptsBeloteNS >= contrat){
				return this.get("ptsReelsNS") + contrat;
			}
			else {
				return 0;
			}
		}
		//NS défenseur
		else if((162 - this.get("ptsFaitsNS") + ptsBeloteEO) < contrat){
			return 160 + contrat;
		}
		else {
			return this.get("ptsReelsNS") + ptsBeloteNS;
		}
		
    }.property("ptsReelsNS"),
    ptsMarquesEO: function(){
		var ptsBeloteEO = 0;
		if(this.get("beloteEO")){
			ptsBeloteEO += 20;
		}
		var ptsBeloteNS = 0;
		if(this.get("beloteNS")){
			ptsBeloteNS += 20;
		}
		//EO attaquant
		if(this.get("attaquant") === 'EO'){
			var contrat = 250;
			if(this.get("contrat") !== "Capot"){
				contrat = parseInt(this.get("contrat"));
			}
			
			if(this.get("ptsFaitsEO") + ptsBeloteEO >= contrat){
				return this.get("ptsReelsEO") + contrat;
			}
			else {
				return 0;
			}
		}
		//NS défenseur
		else if((162 - this.get("ptsFaitsEO") + ptsBeloteNS) < contrat){
			return 160 + contrat;
		}
		else {
			return this.get("ptsReelsEO") + ptsBeloteEO;
		}
    }.property("ptsReelsEO"),
	beloteNS: attr('boolean', {defaultValue: false}),
	beloteEO: attr('boolean', {defaultValue: false}),
	partie: DS.belongsTo('partie')
});

App.Partie = DS.Model.extend({
	scoreNS: function(){
        var donnes = this.get("donnes");
        return donnes.reduce(function(previousValue, donne){
            return previousValue + donne.get("ptsMarquesNS");
        }, 0);
    }.property("donnes.@each.ptsMarquesNS"),
    scoreEO: function(){
        var donnes = this.get("donnes");
        return donnes.reduce(function(previousValue, donne){
            return previousValue + donne.get("ptsMarquesEO");
        }, 0);
    }.property("donnes.@each.ptsMarquesEO"),
	donnes: DS.hasMany('donne', {async: true})
});

//Fixtures
App.Donne.FIXTURES = [
	{ id: 1, attaquant: 'NS', contrat: '80', couleur: 'Coeur', ptsFaitsNS: 95, ptsFaitsEO: 67, beloteNS: false, beloteEO: false},
	{ id: 2, attaquant: 'EO', contrat: '120', couleur: 'Pique', ptsFaitsEO: 144, ptsFaitsNS: 38, beloteNS: true, beloteEO: false}
];

App.Partie.FIXTURES = [
	{id: 1,	donnes: [1,2]}
];

//Components
App.MyModalComponent = Ember.Component.extend({
	actions: {
		ok: function() {
			this.$('.modal').modal('hide');
			this.sendAction('ok');
		}
	},
	show: function() {
		this.$('.modal').modal().on('hidden.bs.modal', function() {
			this.sendAction('close');
		}.bind(this));
	}.on('didInsertElement')
});



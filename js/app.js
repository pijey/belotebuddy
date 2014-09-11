App = Ember.Application.create();

//App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'app-emberjs'
});

App.Router.map(function() {
	this.route("index", {path: "/"});
	this.route("partie", {path: "/partie/:partie_id"});
	this.route("parties", {path: "/parties"});
	this.route("donnes", {path: "/donnes/:partie_id"});
});

//Routes
App.PartieRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('partie', params.partie_id);
	}
});

App.PartiesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('partie');
	}
});

App.DonnesRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('partie', params.partie_id);
	}
});

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('partie', {enCours: true});
	},
	actions: {
		newPartie: function(){
			var partie = this.store.createRecord('partie', {enCours: true, date: new Date()});
			partie = partie.save();
			this.set('model',partie);
			this.controllerFor('partie').set('model', partie);
			this.store.find('partie', {enCours: true}).then(function(parties){
				for(var i=0; i<parties.content.length; i++) 
				{
					if(parties.content[i].id !== partie.id){
						parties.content[i].set('enCours',false);
						parties.content[i].save();	
					}
				}
			});
			this.transitionTo('partie');	
		},
		showModal: function(name, partie) {
			var newDonne = this.store.createRecord('donne', {
				attaquant: 'NS',
				partie: partie
			});
			this.controllerFor(name).set('model', newDonne);
			partie.get('donnes').then(function(){
			    partie.get('donnes').addObject(newDonne);
			});
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
App.PartieController = Ember.ObjectController.extend({

});

App.PartiesController = Ember.ArrayController.extend({
	actions:{
		deletePartie: function(id){
			this.store.find('partie', id).then(function (partie) {
			  partie.destroyRecord(); 
			});
		}
	}
});

App.AjouterDonneModalController = Ember.ObjectController.extend({
	contrats: ['80','90','100','110','120','130','140','150','160','170',"Capot"],
	couleurs: ["Coeur","Carreau","Pique","Trèfle","Sans-Atout","Tout-Atout"],
	partie: {},
	actions: {
		save: function() {
			this.model.save();
  		},
  		updatedPtsFaitsNS: function(){
  			this.model.set('ptsFaitsEO', 162 - parseInt(this.get('ptsFaitsNS')));
  			this.calculerPoints();
  		},
  		updatedPtsFaitsEO: function(){
  			this.model.set('ptsFaitsNS', 162 - parseInt(this.get('ptsFaitsEO')));
  			this.calculerPoints();
  		}
	},
	calculerPoints: function(){
		//Calcul des points reels
		this.model.set('ptsReelsEO',Math.round(this.get("ptsFaitsEO") / 10) * 10);
		this.model.set('ptsReelsNS',Math.round(this.get("ptsFaitsNS") / 10) * 10);

		var total = 162;
		var coef = 1.0;
		
		var atmod = 0;
		var demod = 0;
		
		var atreste = 0;
		var dereste = 0;
			
		var ptsAttaque = 0;
		var ptsDefense = 0;
		var beloteAttaque = false;
		var beloteDefense = false;
		if(this.model.get('attaquant') === 'NS'){
			ptsAttaque = this.model.get("ptsReelsNS");
			ptsDefense = this.model.get("ptsReelsEO");
			if(this.model.get('beloteNS')){
				beloteAttaque = true;
			}
			if(this.model.get('beloteEO')){
				beloteDefense = true;
			}
		}
		else if(this.model.get('attaquant') === 'EO'){
			ptsAttaque = this.model.get("ptsReelsEO");
			ptsDefense = this.model.get("ptsReelsNS");
			if(this.model.get('beloteEO')){
				beloteAttaque = true;
			}
			if(this.model.get('beloteNS')){
				beloteDefense = true;
			}
		}

		if(this.model.get('couleur') === 'Tout-Atout')
		{
			//Tout Atout
			total = 258;
			coef = 0.6279;
		}
		
		atmod = Math.floor(ptsAttaque * coef) % 10;
		demod = Math.floor(ptsDefense * coef) % 10;
		
		if(atmod >= 5)
			atreste = 10;
		if(demod >= 5)
			dereste = 10;
		
		if(beloteAttaque)
		{
			ptsAttaque += 20;
		}
			
		if(beloteDefense)
		{
			ptsDefense += 20;
		}
		
		var ptsMarquesDefense = Math.floor(parseInt((ptsDefense * coef)) + dereste - demod);
		var ptsMarquesAttaque = Math.floor(parseInt((ptsAttaque * coef)) + atreste - atmod);

		var contratString = this.model.get('contrat');
		var contrat;
		if(contratString !== "Capot"){
			contrat = parseInt(contratString);
		}
		ptsmarques = parseInt(Math.floor(ptsAttaque * coef));
		
		if(contrat <= ptsmarques)
		{
			if(this.model.get('attaquant') === 'NS'){
				this.model.set('ptsMarquesNS',ptsMarquesAttaque + contrat);
				this.model.set('ptsMarquesEO',ptsMarquesDefense);
			}
			else {
				this.model.set('ptsMarquesNS',ptsMarquesDefense);
				this.model.set('ptsMarquesEO',ptsMarquesAttaque + contrat);
			}
		}
		else
		{
			if(this.model.get('attaquant') === 'NS'){
				this.model.set('ptsMarquesNS',0);
				this.model.set('ptsMarquesEO',160 + contrat);
			}
			else {
				this.model.set('ptsMarquesNS',160 + contrat);
				this.model.set('ptsMarquesEO',0);
			}
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
	ptsReelsNS: attr('number'),
	ptsReelsEO: attr('number'),
	ptsMarquesNS: attr('number'),
	ptsMarquesEO: attr('number'),
	/*ptsReelsNS: function(){
        return Math.round(this.get("ptsFaitsEO") / 10) * 10;
    }.property("ptsFaitsEO"),
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
				return parseInt(this.get("ptsReelsNS")) + contrat;
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
		
    }.property("ptsReelsNS", "attaquant", "contrat", "couleur", "beloteNS", "beloteEO"),
    ptsMarquesEO: function(){
		var ptsBeloteEO = 0;
		if(this.get("beloteEO")){
			ptsBeloteEO = 20;
		}
		var ptsBeloteNS = 0;
		if(this.get("beloteNS")){
			ptsBeloteNS = 20;
		}
		//EO attaquant
		if(this.get("attaquant") === 'EO'){
			var contrat = 250;
			if(this.get("contrat") !== "Capot"){
				contrat = parseInt(this.get("contrat"));
			}
			
			if(this.get("ptsFaitsEO") + ptsBeloteEO >= contrat){
				return parseInt(this.get("ptsReelsEO")) + contrat;
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
			return parseInt(this.get("ptsReelsEO")) + ptsBeloteEO;
		}
    }.property("ptsReelsEO", "attaquant", "contrat", "couleur", "beloteNS", "beloteEO"),*/
	beloteNS: attr('boolean', {defaultValue: false}),
	beloteEO: attr('boolean', {defaultValue: false}),
	partie: DS.belongsTo('partie')
});

App.Partie = DS.Model.extend({
	enCours: attr("boolean"),
	date: attr('date'),
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

/*Fixtures
App.Donne.FIXTURES = [
	{ id: 1, attaquant: 'NS', contrat: '80', couleur: 'Coeur', ptsFaitsNS: 95, ptsFaitsEO: 67, beloteNS: false, beloteEO: false},
	{ id: 2, attaquant: 'EO', contrat: '120', couleur: 'Pique', ptsFaitsEO: 144, ptsFaitsNS: 38, beloteNS: true, beloteEO: false}
];

App.Partie.FIXTURES = [
	{id: 1,	enCours: true, donnes: [1,2]}
];*/

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



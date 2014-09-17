App = Ember.Application.create();

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

App.AllDonnesRoute = Ember.Route.extend({
	model: function() {
		return this.store.all('donne');
	}
});

App.DonnesRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('partie', params.partie_id);
	}
});

App.ApplicationRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('partie'/*, {enCours: true}*/);
	},
	actions: {
		newPartie: function(){
			var partie = this.store.createRecord('partie', {enCours: true, date: new Date()});
			partie.save();
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
			this.transitionTo('partie', partie);
		},
		showModal: function(name, partie) {
			var newDonne = this.store.createRecord('donne', {
				attaquant: 'NS'
			});
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

App.AllDonnesController = Ember.ArrayController.extend({
	actions:{
		deleteDonne: function(id){
			this.store.find('donne', id).then(function (donne) {
			  donne.destroyRecord(); 
			});
		}
	}
});

App.DonnesController = Ember.ObjectController.extend({
	actions:{
		deleteDonne: function(id){
			this.store.find('donne', id).then(function (donne) {
			  donne.destroyRecord(); 
			});
		}
	}
});

App.AjouterDonneModalController = Ember.ObjectController.extend({
	contrats: ['80','90','100','110','120','130','140','150','160','170',"Capot"],
	couleurs: ["Coeur","Carreau","Pique","Trèfle","Sans-Atout","Tout-Atout"],
	needs: "partie",
	partie: Ember.computed.alias("controllers.partie.model"), 
	actions: {
		save: function() {
			var partie = this.get("partie");
			var donne = this.model;
			var donnes = partie.get('donnes');

			donnes.addObject(donne);
			donne.set('partie', partie);
			donne.save().then(function(){
				partie.save();	
			});
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
			this.model.set('donneFaite', true);
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
			this.model.set('donneFaite', false);
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
	donneFaite: attr('boolean'),
	diffContrat: function(){
		if(this.get('attaquant') === 'NS'){
			return Math.abs(parseInt(this.get('contrat') - this.get('ptsFaitsNS')));
		} 
		else {
			return Math.abs(parseInt(this.get('contrat') - this.get('ptsFaitsEO')));
		}
	}.property('contrat', 'attaquant', 'ptsFaitsNS', 'ptsFaitsEO'),
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
	donnes: DS.hasMany('donne')
});

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



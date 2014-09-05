App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return this.store.all('donne');
	},
	scoreNS: function() {
		return this.model;
	}.property('todos.@each.ptsMarquesNS'),
	scoreEO: function() {
		return this.model;
	}.property('todos.@each.ptsMarquesEO')
});

App.ApplicationRoute = Ember.Route.extend({
	actions: {
		showModal: function(name, content) {
			this.controllerFor(name).set('content', content);
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

//Controllers
App.AjouterDonneModalController = Ember.ObjectController.extend({
	actions: {
		save: function() {
      // save to server
  }
}
});

//Models
var attr = DS.attr;
App.Donne = DS.Model.extend({
	id: attr(),
	attaquant: attr('string'),
	contrat: attr('string'),
	couleur: attr('string'),
	ptsFaitsNS: attr('number'),
	ptsFaitsEO: attr('number'),
	ptsReelsNS: function() {return this.get('ptsFaitsNS');}.property('attaquant', 'ptsFaitsNS', 'beloteNS', 'contrat', 'couleur'),
	ptsReelsEO: function() {return this.get('ptsFaitsEO');}.property('attaquant', 'ptsFaitsEO', 'beloteEO', 'contrat', 'couleur'),
	ptsMarquesNS: function() {return this.get('ptsReelsNS');}.property('attaquant', 'ptsReelsNS', 'beloteNS', 'contrat', 'couleur'),
	ptsMarquesEO: function() {return this.get('ptsReelsEO');}.property('attaquant', 'ptsReelsEO', 'beloteEO', 'contrat', 'couleur'),
	beloteNS: attr('boolean', {defaultValue: false}),
	beloteEO: attr('boolean', {defaultValue: false})
});

App.Donne.FIXTURES = [
	{ id: 1, attaquant: 'NS', contrat: '80', couleur: 'Coeur', ptsFaitsNS: '95', ptsFaitsEO: '67',beloteNS: false, beloteEO: false},
	{ id: 2, attaquant: 'EO', contrat: '120', couleur: 'Pique', ptsFaitsNS: '144', ptsFaitsEO: '38',beloteNS: false, beloteEO: true}
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



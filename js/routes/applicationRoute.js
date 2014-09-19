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
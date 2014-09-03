App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return ['red', 'yellow', 'blue'];
	}
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



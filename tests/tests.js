// in order to see the app running inside the QUnit runner
App.rootElement = '#ember-testing';

// Common test setup
emq.globalize();
setResolver(Ember.DefaultResolver.create({ namespace: App }));
App.setupForTesting();
App.injectTestHelpers();

// common QUnit module declaration
module("Integration tests", {
  setup: function() {
    // before each test, ensure the application is ready to run.
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    // reset the application state between each test
    App.reset();
  }
});

//Unit tests
moduleFor('controller:ajouterDonneModal', 'Controleur Ajouter Donne', {
  needs: ['controller:partie']
});

//Test calcul des points
test('Calcul des points : 80 Coeur NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "80",
        couleur: "Coeur",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 85,
        ptsFaitsEO: 77
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 90, "Points Reels NS : 90");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 80");
  equal(controller.model.get('ptsMarquesNS'), 170, "Points marqués NS : 170");
  equal(controller.model.get('ptsMarquesEO'), 80, "Points marqués EO : 80");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 80 Coeur NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "80",
        couleur: "Coeur",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 78,
        ptsFaitsEO: 84
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 80, "Points Reels NS : 80");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 80");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 240, "Points marqués EO : 240");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 80 Coeur NS litige', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "80",
        couleur: "Coeur",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 81,
        ptsFaitsEO: 81
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 80, "Points Reels NS : 80");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 80");
  equal(controller.model.get('ptsMarquesNS'), 160, "Points marqués NS : 160");
  equal(controller.model.get('ptsMarquesEO'), 80, "Points marqués EO : 80");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 100 Coeur NS fait avec belote NS', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "100",
        couleur: "Coeur",
        beloteNS: true,
        beloteEO: false,
        ptsFaitsNS: 94,
        ptsFaitsEO: 68
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 90, "Points Reels NS : 90");
  equal(controller.model.get('ptsReelsEO'), 70, "Points Reels EO : 70");
  equal(controller.model.get('ptsMarquesNS'), 210, "Points marqués NS : 210");
  equal(controller.model.get('ptsMarquesEO'), 70, "Points marqués EO : 70");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 100 Coeur NS fait avec belote EO', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "100",
        couleur: "Coeur",
        beloteNS: false,
        beloteEO: true,
        ptsFaitsNS: 104,
        ptsFaitsEO: 58
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 100, "Points Reels NS : 100");
  equal(controller.model.get('ptsReelsEO'), 60, "Points Reels EO : 60");
  equal(controller.model.get('ptsMarquesNS'), 200, "Points marqués NS : 200");
  equal(controller.model.get('ptsMarquesEO'), 80, "Points marqués EO : 80");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 100 Coeur NS chuté avec belote NS', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "100",
        couleur: "Coeur",
        beloteNS: true,
        beloteEO: false,
        ptsFaitsNS: 76,
        ptsFaitsEO: 84
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 80, "Points Reels NS : 100");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 60");
  equal(controller.model.get('ptsMarquesNS'), 20, "Points marqués NS : 20");
  equal(controller.model.get('ptsMarquesEO'), 260, "Points marqués EO : 260");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 100 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "100",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 159,
        ptsFaitsEO: 99
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 100, "Points Reels NS : 100");
  equal(controller.model.get('ptsReelsEO'), 60, "Points Reels EO : 60");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 260, "Points marqués EO : 260");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 100 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "100",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 160,
        ptsFaitsEO: 98
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 100, "Points Reels NS : 100");
  equal(controller.model.get('ptsReelsEO'), 60, "Points Reels EO : 60");
  equal(controller.model.get('ptsMarquesNS'), 200, "Points marqués NS : 200");
  equal(controller.model.get('ptsMarquesEO'), 60, "Points marqués EO : 60");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});
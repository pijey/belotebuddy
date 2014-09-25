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
  equal(controller.model.get('ptsReelsNS'), 80, "Points Reels NS : 80");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 80");
  equal(controller.model.get('ptsMarquesNS'), 20, "Points marqués NS : 20");
  equal(controller.model.get('ptsMarquesEO'), 260, "Points marqués EO : 260");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

//Tout-Atout
test('Calcul des points : 80 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "80",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 128,
        ptsFaitsEO: 130
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 80, "Points Reels NS : 80");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 80");
  equal(controller.model.get('ptsMarquesNS'), 160, "Points marqués NS : 160");
  equal(controller.model.get('ptsMarquesEO'), 80, "Points marqués EO : 80");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 90 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "90",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 144,
        ptsFaitsEO: 114
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 90, "Points Reels NS : 90");
  equal(controller.model.get('ptsReelsEO'), 70, "Points Reels EO : 70");
  equal(controller.model.get('ptsMarquesNS'), 180, "Points marqués NS : 180");
  equal(controller.model.get('ptsMarquesEO'), 70, "Points marqués EO : 70");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
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

test('Calcul des points : 110 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "110",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 176,
        ptsFaitsEO: 82
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 110, "Points Reels NS : 110");
  equal(controller.model.get('ptsReelsEO'), 50, "Points Reels EO : 50");
  equal(controller.model.get('ptsMarquesNS'), 220, "Points marqués NS : 220");
  equal(controller.model.get('ptsMarquesEO'), 50, "Points marqués EO : 50");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 120 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "120",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 192,
        ptsFaitsEO: 66
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 120, "Points Reels NS : 120");
  equal(controller.model.get('ptsReelsEO'), 40, "Points Reels EO : 40");
  equal(controller.model.get('ptsMarquesNS'), 240, "Points marqués NS : 240");
  equal(controller.model.get('ptsMarquesEO'), 40, "Points marqués EO : 40");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 130 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "130",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 208,
        ptsFaitsEO: 50
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 130, "Points Reels NS : 130");
  equal(controller.model.get('ptsReelsEO'), 30, "Points Reels EO : 30");
  equal(controller.model.get('ptsMarquesNS'), 260, "Points marqués NS : 260");
  equal(controller.model.get('ptsMarquesEO'), 30, "Points marqués EO : 30");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 140 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "140",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 224,
        ptsFaitsEO: 34
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 140, "Points Reels NS : 140");
  equal(controller.model.get('ptsReelsEO'), 20, "Points Reels EO : 20");
  equal(controller.model.get('ptsMarquesNS'), 280, "Points marqués NS : 280");
  equal(controller.model.get('ptsMarquesEO'), 20, "Points marqués EO : 20");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 150 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "150",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 240,
        ptsFaitsEO: 18
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 150, "Points Reels NS : 150");
  equal(controller.model.get('ptsReelsEO'), 10, "Points Reels EO : 10");
  equal(controller.model.get('ptsMarquesNS'), 300, "Points marqués NS : 300");
  equal(controller.model.get('ptsMarquesEO'), 10, "Points marqués EO : 10");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 160 Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "160",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 256,
        ptsFaitsEO: 2
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 160, "Points Reels NS : 160");
  equal(controller.model.get('ptsReelsEO'), 0, "Points Reels EO : 0");
  equal(controller.model.get('ptsMarquesNS'), 320, "Points marqués NS : 320");
  equal(controller.model.get('ptsMarquesEO'), 0, "Points marqués EO : 0");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : Capot Tout-Atout NS fait', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "Capot",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 258,
        ptsFaitsEO: 0
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 160, "Points Reels NS : 160");
  equal(controller.model.get('ptsReelsEO'), 0, "Points Reels EO : 0");
  equal(controller.model.get('ptsMarquesNS'), 500, "Points marqués NS : 500");
  equal(controller.model.get('ptsMarquesEO'), 0, "Points marqués EO : 0");
  equal(controller.model.get('donneFaite'), true, "Donne faite");
});

test('Calcul des points : 80 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "80",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 126,
        ptsFaitsEO: 132
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 80, "Points Reels NS : 80");
  equal(controller.model.get('ptsReelsEO'), 80, "Points Reels EO : 80");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 240, "Points marqués EO : 240");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 90 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "90",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 142,
        ptsFaitsEO: 116
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 90, "Points Reels NS : 90");
  equal(controller.model.get('ptsReelsEO'), 70, "Points Reels EO : 70");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 250, "Points marqués EO : 250");
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
        ptsFaitsNS: 158,
        ptsFaitsEO: 100
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 100, "Points Reels NS : 100");
  equal(controller.model.get('ptsReelsEO'), 60, "Points Reels EO : 60");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 260, "Points marqués EO : 260");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 110 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "110",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 174,
        ptsFaitsEO: 84
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 110, "Points Reels NS : 110");
  equal(controller.model.get('ptsReelsEO'), 50, "Points Reels EO : 50");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 270, "Points marqués EO : 270");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 120 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "120",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 190,
        ptsFaitsEO: 68
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 120, "Points Reels NS : 120");
  equal(controller.model.get('ptsReelsEO'), 40, "Points Reels EO : 40");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 280, "Points marqués EO : 280");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 130 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "130",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 206,
        ptsFaitsEO: 52
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 130, "Points Reels NS : 130");
  equal(controller.model.get('ptsReelsEO'), 30, "Points Reels EO : 30");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 290, "Points marqués EO : 290");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 140 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "140",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 222,
        ptsFaitsEO: 36
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 140, "Points Reels NS : 140");
  equal(controller.model.get('ptsReelsEO'), 20, "Points Reels EO : 20");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 300, "Points marqués EO : 300");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 150 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "150",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 238,
        ptsFaitsEO: 20
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 150, "Points Reels NS : 150");
  equal(controller.model.get('ptsReelsEO'), 10, "Points Reels EO : 10");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 310, "Points marqués EO : 310");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : 160 Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "160",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 254,
        ptsFaitsEO: 4
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 160, "Points Reels NS : 160");
  equal(controller.model.get('ptsReelsEO'), 0, "Points Reels EO : 0");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 320, "Points marqués EO : 320");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

test('Calcul des points : Capot Tout-Atout NS chuté', function() {
  var controller = this.subject();
  controller.set('partie', Ember.Object.create({enCours: true, date: new Date()}));
  controller.set('model',Ember.Object.create({
        attaquant: 'NS',
        contrat: "Capot",
        couleur: "Tout-Atout",
        beloteNS: false,
        beloteEO: false,
        ptsFaitsNS: 257,
        ptsFaitsEO: 1
      }));
  controller.calculerPoints();
  equal(controller.model.get('ptsReelsNS'), 160, "Points Reels NS : 160");
  equal(controller.model.get('ptsReelsEO'), 0, "Points Reels EO : 0");
  equal(controller.model.get('ptsMarquesNS'), 0, "Points marqués NS : 0");
  equal(controller.model.get('ptsMarquesEO'), 370, "Points marqués EO : 370");
  equal(controller.model.get('donneFaite'), false, "Donne chutée");
});

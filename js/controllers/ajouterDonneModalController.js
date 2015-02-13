App.AjouterDonneModalController = Ember.ObjectController.extend({
	contrats: ['80','90','100','110','120','130','140','150','160','170',"Capot"],
	couleurs: ["Coeur","Carreau","Pique","Trèfle","Sans-Atout","Tout-Atout"],
	needs: "partie",
	partie: Ember.computed.alias("controllers.partie.model"), 
	isBeloteNSDisabled: function(){
		if (this.model.get('couleur') === 'Sans-Atout' || this.model.get('beloteEO')){
			return true;
		}
		return false;
	}.property('model.couleur', 'model.beloteEO'),
	isBeloteEODisabled: function(){
		if (this.model.get('couleur') === 'Sans-Atout' || this.model.get('beloteNS')){
			return true;
		}
		return false;
	}.property('model.couleur', 'model.beloteNS'),
	updateBeloteNS: function(){
		if (this.model.get('ptsFaitsNS') && this.controleCoherence()){
			this.calculerPoints();
		}
	}.observes('model.beloteNS'),
	updateBeloteEO: function(){
		if (this.model.get('ptsFaitsEO') && this.controleCoherence()){
			this.calculerPoints();
		}
	}.observes('model.beloteEO'),
	actions: {
		save: function() {
			var partie = this.get("partie");
			var donne = this.model;
			donne.set("partie", partie);
			donne.save().then(function(){
				partie.get('donnes').addObject(donne);
				partie.save();
			});
  		},
  		updatedPtsFaitsNS: function(){
  			this.model.set('ptsFaitsEO', 162 - parseInt(this.get('ptsFaitsNS')));
  			if (this.controleCoherence()){
				this.calculerPoints();
			}
  		},
  		updatedPtsFaitsEO: function(){
  			this.model.set('ptsFaitsNS', 162 - parseInt(this.get('ptsFaitsEO')));
  			if (this.controleCoherence()){
				this.calculerPoints();
			}
  		}
	},
	controleCoherence: function(){
		if(this.model.get('attaquant') !== 'NS' && this.model.get('attaquant') !== 'EO'){
			alert('Merci de choisir un attaquant');
		}
		if(isNaN(parseInt(this.model.get('ptsFaitsEO'))) || isNaN(parseInt(this.model.get('ptsFaitsNS')))){
			alert('Le nombre de points renseigné est invalide');
		}
		if(parseInt(this.model.get('contrat')) === "Sans-Atout" && (this.model.get('beloteNS')  || this.model.get('beloteEO'))){
			alert('Il n\'y a pas de belote à sans-atout');
		}

		return true;
	},
	calculerPoints: function(){
		var total = 162;
		var coef = 1.0;
		
		var atmod = 0;
		var demod = 0;
		
		var atreste = 0;
		var dereste = 0;
			
		var ptsAttaque = 0;
		var ptsDefense = 0;
		var ptsBeloteAttaque = 0;
		var ptsBeloteDefense = 0;
		var beloteAttaque = false;
		var beloteDefense = false;

		if(this.model.get('attaquant') === 'NS'){
			ptsAttaque = parseInt(this.model.get("ptsFaitsNS"));
			ptsDefense = parseInt(this.model.get("ptsFaitsEO"));
			if(this.model.get('beloteNS')){
				beloteAttaque = true;
			}
			if(this.model.get('beloteEO')){
				beloteDefense = true;
			}
		}
		else if(this.model.get('attaquant') === 'EO'){
			ptsAttaque = parseInt(this.model.get("ptsFaitsEO"));
			ptsDefense = parseInt(this.model.get("ptsFaitsNS"));
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
			coef = 0.627906976744186;
		}
		
		//Calcul des points reels
		this.model.set('ptsReelsEO',Math.round(Math.floor(this.get("ptsFaitsEO") * coef) / 10) * 10);
		this.model.set('ptsReelsNS',Math.round(Math.floor(this.get("ptsFaitsNS") * coef) / 10) * 10);

		atmod = Math.floor(ptsAttaque * coef) % 10;
		demod = Math.floor(ptsDefense * coef) % 10;
		
		if(atmod >= 5)
			atreste = 10;
		if(demod >= 5)
			dereste = 10;
		
		if(beloteAttaque)
		{
			ptsBeloteAttaque = 20;
			ptsAttaque += ptsBeloteAttaque;
		}
			
		if(beloteDefense)
		{
			ptsBeloteDefense = 20;
			ptsDefense += ptsBeloteDefense;
		}
		
		var ptsMarquesDefense = Math.floor(parseInt((ptsDefense * coef)) + dereste - demod);
		var ptsMarquesAttaque = Math.floor(parseInt((ptsAttaque * coef)) + atreste - atmod);

		var contratString = this.model.get('contrat');
		var contrat;
		
		ptsmarques = parseInt(Math.floor(ptsAttaque * coef));
		if(contratString !== "Capot"){
			contrat = parseInt(contratString);
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
					this.model.set('ptsMarquesNS',ptsBeloteAttaque);
					this.model.set('ptsMarquesEO',160 + contrat);
				}
				else {
					this.model.set('ptsMarquesNS',160 + contrat);
					this.model.set('ptsMarquesEO',ptsBeloteAttaque);
				}
			}
		}
		else {
			contrat = 250;
			if(ptsDefense > 0){
				this.model.set('donneFaite', false);
				if(this.model.get('attaquant') === 'NS'){
					this.model.set('ptsMarquesNS',ptsBeloteAttaque);
					this.model.set('ptsMarquesEO',160 + contrat);
				}
				else {
					this.model.set('ptsMarquesNS',160 + contrat);
					this.model.set('ptsMarquesEO',ptsBeloteAttaque);
				}
			}
			else {
				this.model.set('donneFaite', true);
				if(this.model.get('attaquant') === 'NS'){
					this.model.set('ptsMarquesNS',500 + ptsBeloteAttaque);
					this.model.set('ptsMarquesEO',0);
				}
				else {
					this.model.set('ptsMarquesNS',0);
					this.model.set('ptsMarquesEO',500 + ptsBeloteAttaque);
				}
			}
		}
	}
});
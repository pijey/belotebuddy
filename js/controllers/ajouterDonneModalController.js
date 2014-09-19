App.AjouterDonneModalController = Ember.ObjectController.extend({
	contrats: ['80','90','100','110','120','130','140','150','160','170',"Capot"],
	couleurs: ["Coeur","Carreau","Pique","Trèfle","Sans-Atout","Tout-Atout"],
	needs: "partie",
	partie: Ember.computed.alias("controllers.partie.model"), 
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
  			this.calculerPoints();
  		},
  		updatedPtsFaitsEO: function(){
  			this.model.set('ptsFaitsNS', 162 - parseInt(this.get('ptsFaitsEO')));
  			this.calculerPoints();
  		}
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
			coef = 0.6279;
		}
		
		//Calcul des points reels
		this.model.set('ptsReelsEO',Math.round(this.get("ptsFaitsEO") * coef / 10) * 10);
		this.model.set('ptsReelsNS',Math.round(this.get("ptsFaitsNS") * coef / 10) * 10);

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
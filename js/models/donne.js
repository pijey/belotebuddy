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
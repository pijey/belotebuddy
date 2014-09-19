var attr = DS.attr;
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
	donnes: DS.hasMany('donne', {async: true}),
});
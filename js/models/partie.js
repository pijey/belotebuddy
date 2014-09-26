var attr = DS.attr;
App.Partie = DS.Model.extend({
	enCours: attr("boolean"),
	nomNS: attr("string", {defaultValue: "Nord-Sud"}),
    nomEO: attr("string", {defaultValue: "Est-Ouest"}),
    date: attr('date'),
    formatedDate: function(){
        return moment(this.get('date')).format('DD/MM/YYYY HH:mm:ss');
    }.property('date'),
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
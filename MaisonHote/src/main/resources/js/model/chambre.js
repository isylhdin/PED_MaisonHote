
var Chambre = Backbone.Model.extend({
	defaults: {
		id:null
		/*titre: '',
		prixParJour: 0,
		nbLit: 0,
		superficie :0*/
	},

	initialize: function(){
		console.log('Chambre créée !');
	},

	validate: function( attrs ) {

		var errors = [];

		if ( !attrs.prixParJour.length ) errors.push('prixParJour');
		if ( !attrs.nbLit.length ) errors.push('nbLit');
		if ( !attrs.superficie.length ) errors.push('superficie');

		if ( errors.length ) return errors;

	}
});

var Chambres = Backbone.Collection.extend({
	model: Chambre,
	//url: 'reservations'
	
	initialize : function() {
        console.log('Collection de chambres crée');
    }
}); 
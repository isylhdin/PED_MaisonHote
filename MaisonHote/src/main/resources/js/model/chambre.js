var Chambre = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("chambres-backbone"),

	defaults: {
		id:null,
		prixParJour: '',
		litSimple: 0,
		litDouble: 0,
		litJumeau: 0,
		tele : false,
		internet : false,
		baignoire : false,
		douche : false
	},

	initialize: function(){
		console.log('Chambre créée !');
	},

	validate: function( attrs ) {

		var errors = [];
		if ( !attrs.prixParJour.length ) errors.push('prixParJour');

		if ( errors.length ){
			console.log("champ(s) qui provoque(nt) une erreur : "+errors);
			return errors;
		}
	}
});

var Chambres = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("chambres-backbone"),
	model: Chambre,
	sort_key: 'id', // default sort key

	initialize : function() {
		console.log('Collection de chambres crée');

	},

	comparator: function(item) {
		return item.get(this.sort_key);
	},
	sortByField: function(fieldName) {
		this.sort_key = fieldName;
		this.sort();
	}
}); 



var couleurs = ['#BAF9F0','#C8F9BA','#F9EABA','#C0BAF9','#F4BAF9'];

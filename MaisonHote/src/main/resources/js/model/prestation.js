var Prestation = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("prestations-backbone"),

	defaults: {
		id:null,
		title: '',
		price: 0,
		number: 0,
		comment: '',
	},

	initialize: function(){
		console.log('Prestation créée !');
	},

	validate: function( attrs ) {
		var errors = [];
		if ( !attrs.title.length ) errors.push('title');
		if ( !attrs.price.length ) errors.push('price');
		if ( !attrs.number.length ) errors.push('number');

		if ( errors.length ){
			console.log("champ(s) qui provoque(nt) une erreur : "+errors);
			return errors;
		}
	}
});

var Prestations = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("prestations-backbone"),
	model: Prestation,
	sort_key: 'id', // default sort key

	initialize : function() {
		console.log('Collection de prestations crée');

	},

	comparator: function(item) {
		return item.get(this.sort_key);
	},
	sortByField: function(fieldName) {
		this.sort_key = fieldName;
		this.sort();
	}
}); 
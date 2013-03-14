var Facture = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("factures-backbone"),

	defaults: {
		id:null,
	},

	initialize: function(){
		console.log('Facture créé !');
	}

});

var Factures = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("factures-backbone"),
	model: Facture,
	sort_key: 'id', // default sort key

	initialize : function() {
		console.log('Collection de factures créée');

	},

	comparator: function(item) {
		return item.get(this.sort_key);
	},
	
	sortByField: function(fieldName) {
		this.sort_key = fieldName;
		this.sort();
	}
}); 
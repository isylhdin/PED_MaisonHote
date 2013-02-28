var GoogleToken = Backbone.Model.extend({
	defaults:{
		id : 0	//id par défaut comme ça on connait son id à l'avance pour le récupérer dans le local storage
	},
	localStorage: new Backbone.LocalStorage("token-backbone"),
});


var FichierConfig = Backbone.Model.extend({
	defaults:{
		id : 0	//id par défaut comme ça on connait son id à l'avance pour le récupérer dans le local storage
	},
	localStorage: new Backbone.LocalStorage("fichier-backbone"),
});


var Reservation = Backbone.Model.extend({
	defaults: {
		date_start: function(){ return new Date(); },
		date_end: function(){ return new Date(); },
		duree: 0,
		prix: 0
	},
	initialize: function(){
		console.log('Réservation créée !');
	}
});

var Reservations = Backbone.Collection.extend({
	model: Reservation,
	//url: 'reservations'
}); 


var Locataire = Backbone.Model.extend({
	defaults: {
		nom: '',
		mail: '',
		phone: 0    
	},
	initialize: function(){
		console.log('Locataire créée !');
	}
});

var Locataires = Backbone.Collection.extend({
	model: Locataire,
	//url: 'reservations'
}); 

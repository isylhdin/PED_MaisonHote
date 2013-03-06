var Token = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("token-backbone"),
});


var FichierConfig = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("fichier-backbone")
});

var CurrentHost = Backbone.Model.extend({
	defaults:{
		id : 0	
	},
	localStorage: new Backbone.LocalStorage("currentHost-backbone")
});


var Reservation = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("resas-backbone"),

	defaults: {
		date_start: function(){ return new Date(); },
		date_end: function(){ return new Date(); },
		duration: 0,
		lastName: '',
		firstName: '',
		nbPersons: 0,
		room: ''
		//price: 0
	},
	initialize: function(){
		console.log('Réservation créée !');
		//this.on('doReset', this.reset);
	}
/*
	validate: function(attrs) {
		var errors = [];
		if (!attrs.lastName.length) errors.push('lastName');
		if (!attrs.firstName.length) errors.push('firstName');
		if (!attrs.phone.length) errors.push('phone');
		if (!attrs.room.length) errors.push('room');
		if (errors.length) return errors;
	}*/
/*	reset: function() {
		this.clear({ silent:true });
		this.set(this.defaults, { silent:true });
		this.trigger("reset");
	}*/
});

var Reservations = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("resas-backbone"),
	model: Reservation
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

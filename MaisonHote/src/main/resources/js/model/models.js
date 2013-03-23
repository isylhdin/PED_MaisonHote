var Token = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('token-backbone'),
});

var FichierConfig = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('fichier-backbone')
});

var CurrentHost = Backbone.Model.extend({
	defaults: {
		id: 0	
	},
	localStorage: new Backbone.LocalStorage('currentHost-backbone')
});

var Reservation = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('resas-backbone'),

	defaults: {
		idResaGroup: 0,
		date_start: function() { return new Date(); },
		date_end: function() { return new Date(); },
		client: '',
		nbPersons: 0,
		room: ''
		//price: 0
	},
	initialize: function() {
		console.log('Réservation créée !');
		//this.on('doReset', this.reset);
	}
});

var Reservations = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage('resas-backbone'),
	model: Reservation,

	nextId: function() {
		if (!this.length) {
			return 1;
		}
		return this.last().get('id') + 1;
	},
	nextGroupId: function() {
		if (!this.length) {
			return 1;
		}
		return this.last().get('idResaGroup') + 1;
	}
});

var Arrhes = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage('arrhes-backbone')
});


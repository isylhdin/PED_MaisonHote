var Reservation = Backbone.Model.extend();

var Reservations = Backbone.Collection.extend({
	model: Reservation,
	url: 'reservations'
}); 
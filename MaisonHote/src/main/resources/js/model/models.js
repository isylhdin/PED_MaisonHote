var GoogleToken = Backbone.Model.extend({
	 localStorage: new Backbone.LocalStorage("token-backbone"),
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

var Chambre = Backbone.Model.extend({
	 defaults: {
        titre: '',
        price: 0,
        nbLit: 0    
    },
    initialize: function(){
   	 console.log('Chambre créée !');
    }
});

var Chambres = Backbone.Collection.extend({
	model: Chambre,
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

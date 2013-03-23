window.ficheSejourView = Backbone.View.extend({

	initialize: function () {
		var reservedRooms;
		window.idResaGroup = jQuery.parseJSON(this.model).idResaGroup;

		this.getAllRooms();
		this.render();

	},

	render: function () { 	
		this.template = _.template(tpl.get('ficheSejourView'));
		$(this.el).html(this.template(this.model));
		var self = this;
		
		reservedRooms.forEach(function(Room){
			var idResa = Room.attributes.id;
			var room = jQuery.parseJSON(localStorage.getItem('resas-backbone-'+idResa));
			$(self.el).find('#rooms').append('<p> Chambre '+ room.room +'</p>');
			
			console.log(Room.attributes.idResaGroup);
		});

		return this;
	},


	getAllRooms: function () { 

		reservedRooms = reservations.filter(function(model){
			return model.attributes.idResaGroup === idResaGroup;
		});	
		console.log(reservedRooms);
	}


});

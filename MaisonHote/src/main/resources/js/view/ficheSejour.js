window.ficheSejourView = Backbone.View.extend({

	initialize: function () {
		var resaGroup;
		var idClient = jQuery.parseJSON(this.model).idClient;
		
		window.client = jQuery.parseJSON(localStorage.getItem('customers-backbone-'+idClient));
		window.idResaGroup = jQuery.parseJSON(this.model).idResaGroup;
		

		this.getAllResaFromGroup();
		this.render();

	},

	render: function () { 	
		this.template = _.template(tpl.get('ficheSejourView'));
		$(this.el).html(this.template(client));
		var self = this;
		
		resaGroup.forEach(function(Resa){
			var idResa = Resa.attributes.id;
			var resa = jQuery.parseJSON(localStorage.getItem('resas-backbone-'+idResa));
			
			var duration = getDuration(resa);
			var computedPrice = computePriceOverDaysForRoom(resa);
			
			var idRoom = resa.room;
			var room = jQuery.parseJSON(localStorage.getItem('chambres-backbone-'+idRoom));
			
			$(self.el).find('#rooms').append('<p> Chambre '+ resa.room +' : '+
					duration + ' jours X '+ room.prixParJour + ' = ' +
					computedPrice +'€</p>');
		});

		return this;
	},

	getAllResaFromGroup: function () { 

		resaGroup = reservations.filter(function(model){
			return model.attributes.idResaGroup === idResaGroup;
		});	
		console.log(resaGroup);
	}


});

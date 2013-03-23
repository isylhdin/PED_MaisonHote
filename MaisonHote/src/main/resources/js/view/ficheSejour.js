window.ficheSejourView = Backbone.View.extend({

	initialize: function () {
		var resaGroup;
		window.idResaGroup = jQuery.parseJSON(this.model).idResaGroup;

		this.getAllResaFromGroup();
		this.render();

	},

	render: function () { 	
		this.template = _.template(tpl.get('ficheSejourView'));
		$(this.el).html(this.template(this.model));
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

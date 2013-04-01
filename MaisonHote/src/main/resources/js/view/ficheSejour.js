window.ficheSejourView = Backbone.View.extend({

	initialize: function () {
		var idClient = jQuery.parseJSON(this.model).idClient;
		this.total = 0;
		
		window.client = jQuery.parseJSON(
			localStorage.getItem('customers-backbone-' + idClient));
		window.idResaGroup = jQuery.parseJSON(this.model).idResaGroup;
		

		this.resaGroup = getAllResaFromGroup(idResaGroup);
		this.render();

	},

	render: function () { 	
		this.template = _.template(tpl.get('ficheSejourView'));
		$(this.el).html(this.template(client));
		var self = this;

		this.resaGroup.forEach(function(Resa) {
			var idResa = Resa.get('id'),
				resa = jQuery.parseJSON(
					localStorage.getItem('resas-backbone-' + idResa)),
				idRoom = resa.room,
				room = jQuery.parseJSON(
					localStorage.getItem('chambres-backbone-' + idRoom)),
				duration = getDuration(resa),
				computedPrice = computePriceOverDaysForRoom(resa);

			self.total += computedPrice;
			
			self.$el.find('#rooms').append(
				'<p><span style=\'color:#3D6DAB\'>Chambre '+ resa.room +
				' </span> : ' + duration + ' jours X ' + room.prixParJour +
				' = ' + computedPrice + '€</p>');
		});		
		
		var remainingPrice,
			arrhes = jQuery.parseJSON(
				localStorage.getItem('arrhes-backbone-0')).montant,
			hasPaidArrhes = jQuery.parseJSON(this.model).arrhes,
			hasPaidArrhesDisplay = (hasPaidArrhes ? 'oui' : 'non'),
			color = (hasPaidArrhes ? 'green' : 'red'),
			b = '<font color=\''+ color + '\'>' + hasPaidArrhesDisplay +
				'</font>';

		this.$('#arrhes').html(
			'<h4> Arrhes payées (' + arrhes + '%)</h4>' + b);

		if (hasPaidArrhes) {
			remainingPrice = this.total - ((arrhes * this.total) / 100);
		} else {
			remainingPrice = this.total;
		}

		this.$('#totalPrice').val(this.total + '€');
		this.$('#remainingPrice').val(remainingPrice + '€');

		return this;
	}
});

window.ficheSejourView = Backbone.View.extend({

	initialize: function () {
		var idClient = this.model.idClient,
			resaGroupPrestas;

		this.total = 0;

		window.client = jQuery.parseJSON(
			localStorage.getItem('customers-backbone-' + idClient));
		window.idResaGroup = this.model.idResaGroup;

		this.resas = getAllResaFromGroup(idResaGroup);
		resaGroupPrestas = resaGroupsPrestas.get(idResaGroup);
		this.prestas = resaGroupPrestas.get('prestas');
		this.render();
	},

	render: function () {
		this.template = _.template(tpl.get('ficheSejourView'));
		$(this.el).html(this.template(client));
		var presta,
			prestaTitle,
			prestaQuantity,
			prestaPrice,
			self = this;

		this.resas.forEach(function(Resa) {
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
				'<p><span style="color: #3d6dab">Chambre '+ resa.room +
				'</span> : ' + duration + ' jour(s) × ' + room.prixParJour +
				' € = ' + computedPrice + ' €</p>');
		});
		for (var idPresta in this.prestas) {
			presta = prestasPourCalendrier.get(idPresta);
			prestaTitle = presta.get('title');
			prestaQuantity = this.prestas[idPresta];
			prestaPrice = presta.get('price');
			computedPrice = prestaPrice * prestaQuantity;

			self.total += computedPrice;

			self.$el.find('#prestations').append(
				'<p><span style="color: #e24e2a">' + prestaTitle +
				'</span> : ' + prestaQuantity + ' × ' + prestaPrice +
				' € = ' + computedPrice + ' €</p>');
		}

		var remainingPrice,
			arrhes = jQuery.parseJSON(
				localStorage.getItem('arrhes-backbone-0')).montant,
			hasPaidArrhes = this.model.arrhes,
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

		this.$('#totalPrice').val(this.total + ' €');
		this.$('#remainingPrice').val(remainingPrice + ' €');

		return this;
	}
});

window.ReservationsView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this);

		this.listenTo(this.collection, 'reset', this.addAll);
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'change', this.change);
		this.listenTo(this.collection, 'destroy', this.destroy);

		this.resaDialogView = new ReservationView({
			el: $('#resaDialog'), collection: this.collection
		});
		this.listenTo(chambresPourCalendrier, 'replace reset add remove',
			this.caption);
		this.listenTo(chambresPourCalendrier, 'replace reset add remove',
			this.reRenderWeekView);

		// si on refresh la page on va chercher les chambres dans le
		// localstorage
		chambresPourCalendrier.fetch();
		prestasPourCalendrier.fetch();
		this.nbRooms = chambresPourCalendrier.length;
		this.resaDialogView.nbRooms = this.nbRooms;

		resaGroupsPrestas.fetch();
	},

	reRenderWeekView: function() {
		this.nbRooms = chambresPourCalendrier.length;
		this.$el.empty();
		this.render();
	},

	render: function() {
		this.$el.empty();
		var roomTitles = chambresPourCalendrier.pluck('id').
				map(function(room) { return 'Chambre ' + room });

		this.$el.fullCalendar({
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'basicWeek,month'
			},
			selectable: true,
			//unselectCancel: '.unselectCanceled',
			editable: true,
			ignoreTimezone: false,
			firstDay: 1,
			select: this.select,
			eventClick: this.eventClick,
			eventDrop: this.eventDropOrResize,
			eventResize: this.eventDropOrResize,
			height: $(document).height() - getBodyPad(),
			roomsNb: this.nbRooms,
			roomColWidth: 0.1,
			rowHeightForEvents: true,
			eventContentToDisplay: this.eventContentToDisplay,
			ordinateTitles: roomTitles
		});
		return this;
	},

	addAll: function() {
		this.$el.fullCalendar(
			'addEventSource', this.collection.toJSON(), true);
	},

	addOne: function(resa) {
		this.$el.fullCalendar('renderEvent', resa.toJSON(), true);
	},
      
	select: function(startDate, endDate, allDay, ev, origRow) {
		this.resaDialogView.model = new Reservation({
			start: startDate, end: endDate
		});
		if (this.$el.fullCalendar('getView').name === 'basicWeek') {
			var roomNum = origRow + 1;
			this.resaDialogView.model.set({
				room: chambresPourCalendrier.get(roomNum).id,
				color: couleurs[roomNum]
			});	
		}
		this.resaDialogView.render();
	},

	eventClick: function(fcEvent) {
		this.resaDialogView.model = this.collection.get(fcEvent.id);
		this.resaDialogView.render();
	},

	change: function(resa) {
		// Look up the underlying event in the calendar and update its details
		// from the model
		var fcEvent = this.$el.fullCalendar('clientEvents', resa.get('id'))[0],
		roomNum = resa.get('room');
		fcEvent.color = couleurs[roomNum];
		fcEvent.lastName = resa.get('lastName');
		fcEvent.firstName = resa.get('firstName');
		fcEvent.phone = resa.get('phone');
		fcEvent.email = resa.get('email');
		fcEvent.room = resa.get('room');
		fcEvent.nbPersons = resa.get('nbPersons');

		this.$el.fullCalendar('updateEvent', fcEvent, true); 
	},

	eventDropOrResize: function(fcEvent) {
		// Lookup the model that has the ID of the event and update its
		// attributes
		this.collection.get(fcEvent.id).save({
			start: fcEvent.start, end: fcEvent.end
		});

		// Affiche le bouton pour sauvegarder la réservation sur le serveur
		// après que ses dates de début/fin aient changé
		if (!$('#SaveRow').length) {
			var text =
					'Veuillez <strong>sauvegarder</strong> pour que vos ' +
					'modifications soient prises en compte sur le serveur ' +
					'<i id="infoSave" class="icon-info-sign" ' +
					'data-toggle="tooltip"></i>',
				contentSaveForm =
					'<div class="control-group">' +
					'<label class="control-label">' + text +
					'</label><div class="controls"><button type="submit" ' +
					'id="submit" class="btn btn-warning">' +
					'Sauvegarder</button></div></div></div>';

			$('#calendar').before(
				'<div id="SaveRow" class="row">' +
				'<div class="span4 offset4 text-center alert">' +
				contentSaveForm + '</div></div>');
			$('#infoSave').tooltip({
				'title' : 'Si vous ne sauvegardez pas, vos modifications ne ' +
				'seront pas prises en compte lors de votre prochaine connexion'
			});
		}
	},

	destroy: function(event) {
		this.$el.fullCalendar('removeEvents', event.id, true);
		this.updateOnServer();
	},

	eventContentToDisplay: function(fcEvent) {
		var view = this.$el.fullCalendar('getView'),
			idClient = fcEvent.idClient,
			content = customersResa.get(idClient);
		
		if (typeof content !== 'undefined') {
			content = content.toJSON();
		} else {
			content = '';
		}

		var client = new Customer(content),
			phone = client.get('phone');
		
		if (view.name === 'basicWeek') {
			return 'M/Mme ' + client.getFullName() + '\n' +
				fcEvent.nbPersons +
				(fcEvent.nbPersons > 1 ? ' personnes' : ' personne') +
				(phone ? '\n☎ ' + phone : '');
		} else if (view.name === 'month') {
			return 'Chambre ' + fcEvent.room + ' | ' + client.getFullName();
		} else {
			return fcEvent.title;
		}
	},

	caption: function() {
		$('#caption').empty();

		chambresPourCalendrier.each(function(Chambre) {
			$('#caption').append(
				'<div id="popover' + Chambre.id +
				'" class="span1" rel="popover" style="background-color:' +
				couleurs[Chambre.id] + '; width:50px; height:30px;"></div>');
			var title = 'Chambre ' + Chambre.id,
				content = '<b>PrixParjour</b> : ' +
					Chambre.get('prixParJour') +
					'<br><b>Nombre de lit simple</b> : ' +
					Chambre.get('litSimple') +
					'<br><b>Nombre de lit double</b> : ' +
					Chambre.get('litDouble') +
					'<br><b>Nombre de lit jumeau</b> : ' +
					Chambre.get('litJumeau');

			$('#popover' + Chambre.id).popover({
				title: title, content: content, trigger: 'hover',
				html: true, placement: 'top'
			});
		});
	},

	updateOnServer: function() {
		var obj = JSON.parse(
			localStorage.getItem('fichier-backbone-resa.json'));

		updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()),
				function(reponse) {
			if (!reponse.error) {
				console.log('réservations mises à jour sur le serveur');
			} else {
				console.log('les réservations n\'ont pas pu être mises à ' +
					'jour sur le serveur');
			}
		});
	},
	close: function() {
		this.resaDialogView.remove();
		this.remove();
	}
});

function getBodyPad() {
	var body = $('body');
	return parseInt(body.css('padding-top').replace('px', '')) +
	parseInt(body.css('padding-bottom').replace('px', ''));
}

window.CalendarView = Backbone.View.extend({

	events: {
		'click #submit' : 'onSubmit'
	},

	initialize: function() {
		// initialisation de la vue
		console.log('Calendar view initialized !');
		$(this.el).html(_.template(tpl.get('CalendarView')));
	},

	onSubmit: function() {
		console.log('submit !');

		var obj = JSON.parse(localStorage.getItem('fichier-backbone-resa.json'));
		updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()), function(reponse) {
			if (!reponse.error) {
				$('#SaveRow').html(
					'<div id="goodResult" class="alert alert-success">' +
					'Vos modifications ont été sauvegardées avec succès !</div>'
				);
				$('#SaveRow').fadeOut(3000, function() {
					$('#SaveRow').remove();
				});	
			} else if (!$('#badResult').length) {
				$('#SaveRow').append(
					'<div id="badResult" class="alert alert-error span2">' +
					'<strong>Sauvegarde échouée</strong>, ' +
					'veuillez vérifier que vous êtes connecté à Internet et réessayez' +
					'</div>'
				);
			}
		});
	}
});

window.EventsView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this); 

		this.collection.bind('reset', this.addAll);
		this.collection.bind('add', this.addOne);
		this.collection.bind('change', this.change);
		this.collection.bind('destroy', this.destroy);

		this.resaView = new ReservationView({ el: $('#eventDialog') });
		chambresPourCalendrier.bind('replace reset add remove', this.caption);
		chambresPourCalendrier.bind('replace reset add remove', this.reRenderWeekView);

		//si on refresh la page on va chercher les chambres dans le localstorage
		chambresPourCalendrier.fetch();
		prestasPourCalendrier.fetch();
		this.nbRooms = chambresPourCalendrier.length;
		this.resaView.nbRooms = this.nbRooms;

		resaGroupsPrestas.fetch();
	},

	reRenderWeekView: function() {
		this.nbRooms = chambresPourCalendrier.length;
		this.resaView.nbRooms = this.nbRooms;
		this.$el.empty();
		this.render();
	},

	render: function() {
		this.$el.empty();
		var roomTitles = chambresPourCalendrier.pluck('id').map(function(room) {return 'Chambre ' + room});
		this.$el.fullCalendar({
			header: {
				left: 'prev,next',
				center: 'title',
				right: 'basicWeek,month'
			},
			selectable: true,
			unselectCancel: '.unselectCanceled',
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
		this.$el.fullCalendar('addEventSource', this.collection.toJSON(), true);
	},
	addOne: function(resa) {
		this.$el.fullCalendar('renderEvent', resa.toJSON(), true);
	},        
	select: function(startDate, endDate, allDay, ev, origRow) {
		this.resaView.collection = this.collection;
		this.resaView.model = new Reservation({start: startDate, end: endDate});
		if (this.$el.fullCalendar('getView').name === 'basicWeek') {
			var roomNum = origRow + 1;
			this.resaView.model.set({
				room: chambresPourCalendrier.get(roomNum).id,
				color: couleurs[roomNum]
			});	
		}
		this.resaView.render();
	},
	eventClick: function(fcEvent) {
		this.resaView.model = this.collection.get(fcEvent.id);
		this.resaView.render();
	},
	change: function(resa) {
		// Look up the underlying event in the calendar and update its details from the model
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
		// Lookup the model that has the ID of the event and update its attributes
		this.collection.get(fcEvent.id).save({
			start: fcEvent.start, end: fcEvent.end
		});

		// Affiche le bouton pour sauvegarder la rÃ©servation sur le serveur
		// aprÃ¨s que ses dates de dÃ©but/fin aient changÃ©
		if (!$('#SaveRow').length) {
			var text =
				'Veuillez <strong>sauvegarder</strong> pour que vos ' +
				'modifications soient prises en compte sur le serveur ' +
				'<i id="infoSave" class="icon-info-sign" data-toggle="tooltip"></i>',
				contentSaveForm =
				'<div class="control-group"><label class="control-label">' +
				text + '</label><div class="controls">' +
				'<button type="submit" id="submit" class="btn btn-warning">' +
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
		var view = this.$el.fullCalendar('getView');

		var idClient = fcEvent.idClient;
		var content = customersResa.get(idClient);
		
		if(typeof(content) !== 'undefined'){
			content = content.toJSON();
		}else{
			content='';
		}
		
		var client = new Customer(content);
		
		if (view.name === 'basicWeek') {
			return 'M/Mme ' + client.attributes.name + '\n' + fcEvent.nbPersons +
			(fcEvent.nbPersons > 1 ? ' personnes' : ' personne') +
			(fcEvent.phone ? '\n☎ ' + client.attributes.phone : '');
		} else if (view.name === 'month') {
			return 'Chambre ' + fcEvent.room + ' | ' + client.attributes.name;
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
				content =
				'<b>PrixParjour</b> : ' + Chambre.get('prixParJour') +
				'<br><b>Nombre de lit simple</b> : ' + Chambre.get('litSimple') +
				'<br><b>Nombre de lit double</b> : ' + Chambre.get('litDouble') +
				'<br><b>Nombre de lit jumeau</b> : ' + Chambre.get('litJumeau');

			$('#popover' + Chambre.id).popover({
				title: title, content: content, trigger: 'hover',
				html: true, placement: 'top'
			});
		});
	},

	updateOnServer: function() {
		var obj = JSON.parse(localStorage.getItem('fichier-backbone-resa.json'));
		updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()), function(reponse) {
			if (!reponse.error) {
				console.log('réservations mises à jour sur le serveur'); 
			} else {
				console.log('les réservations n\'ont pas pu être mises à jour sur le serveur'); 
			}
		});
	}

});

function getBodyPad() {
	var body = $('body');
	return parseInt(body.css('padding-top').replace('px', '')) +
	parseInt(body.css('padding-bottom').replace('px', ''));
}

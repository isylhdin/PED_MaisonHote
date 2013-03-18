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

		var obj = JSON.parse(localStorage.getItem("fichier-backbone-resa.json"));
		updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()), function(reponse) {
			if (!reponse.error) {
				$('#SaveRow').html("<div id='goodResult' class='alert alert-success'>Vos modifications ont été sauvegardées avec succès !</div>");
				$('#SaveRow').fadeOut(3000, function() {
					$('#SaveRow').remove();
				});	
			} else if (!$('#badResult').length) {
				$('#SaveRow').append("<div id='badResult' class='alert alert-error span2'><strong>Sauvegarde échouée</strong>, veuillez vérifier que vous êtes connecté à Internet et réessayez</div>");
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

		this.eventView = new EventView({el: $('#eventDialog')});
		chambresPourCalendrier.bind('replace reset add remove', this.caption);
		chambresPourCalendrier.bind('replace reset add remove', this.renderList);
		chambresPourCalendrier.bind('replace reset add remove', this.reRenderWeekView);
		//si on refresh la page ça va chercher les chambres dans le localstorage
		chambresPourCalendrier.fetch();
		this.nbRooms = chambresPourCalendrier.length;
		this.eventView.nbRooms = this.nbRooms;
	},
	
	reRenderWeekView: function() {
		this.nbRooms = chambresPourCalendrier.length;
		$(this.el).empty();
		this.render();
	},

	render: function() {
		$(this.el).empty();
		var roomTitles = chambresPourCalendrier.pluck('id').map(function(room) {return 'Chambre ' + room});
		$(this.el).fullCalendar({
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
	},
	addAll: function() {
		this.$el.fullCalendar('addEventSource', this.collection.toJSON(), true);
	},
	addOne: function(event) {
		this.$el.fullCalendar('renderEvent', event.toJSON(), true);
	},        
	select: function(startDate, endDate, allDay, ev, origRow) {
		this.eventView.collection = this.collection;
		this.eventView.model = new Reservation({start: startDate, end: endDate});
		if (this.$el.fullCalendar('getView').name === 'basicWeek') {
			var roomNum = origRow + 1;
			this.eventView.model.set({
				room: chambresPourCalendrier.get(roomNum).id,
				color: couleurs[roomNum]
			});	
		}
		this.eventView.render();
	},
	eventClick: function(fcEvent) {
		this.eventView.model = this.collection.get(fcEvent.id);
		this.eventView.render();
	},
	change: function(event) {
		// Look up the underlying event in the calendar and update its details from the model
		var fcEvent = this.$el.fullCalendar("clientEvents", event.get('id'))[0],
		roomNum = event.get("room");
		fcEvent.color = couleurs[roomNum];
		fcEvent.lastName = event.get("lastName");
		fcEvent.firstName = event.get("firstName");
		fcEvent.phone = event.get("phone");
		fcEvent.email = event.get("email");
		fcEvent.room = event.get("room");
		fcEvent.nbPersons = event.get("nbPersons");
		fcEvent.title = this.eventContentToDisplay(fcEvent);

		this.$el.fullCalendar("updateEvent", fcEvent, true); 
	},
	eventDropOrResize: function(fcEvent) {
		// Lookup the model that has the ID of the event and update its attributes
		this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});

		// Affiche le bouton pour sauvegarder la réservation sur le serveur
		// après que ses dates de début/fin aient changé
		if (!$('#SaveRow').length) {
			var text = "Veuillez <strong>sauvegarder</strong> pour que vos modifications soient prises en compte sur le serveur <i id='infoSave' class='icon-info-sign' data-toggle='tooltip'></i>";
			var contentSaveForm = "<div class='control-group'><label class='control-label'>" + text + "</label>" +
			"<div class='controls'><button type='submit' id='submit' class='btn btn-warning'>Sauvegarder</button></div></div></div>"; 

			$('#calendar').before("<div id='SaveRow' class='row'> <div class='span4 offset4 text-center alert'>" + contentSaveForm + "</div></div>");
			$('#infoSave').tooltip({'title' : 'Si vous ne sauvegardez pas, vos modifications ne seront pas prises en compte lors de votre prochaine connexion'});
		}
	},
	destroy: function(event) {
		this.$el.fullCalendar("removeEvents", event.id, true);
		this.updateOnServer();
	},

	eventContentToDisplay: function(fcEvent) {
		var view = this.$el.fullCalendar("getView");

		if (view.name === 'basicWeek') {
			return "M/Mme " + fcEvent.lastName + "\n" + fcEvent.nbPersons +
			(fcEvent.nbPersons > 1 ? " personnes" : " personne") +
			(fcEvent.phone ? "\n☎ " + fcEvent.phone : "");
		} else if (view.name === "month") {
			return "Chambre " + fcEvent.room + " | " + fcEvent.lastName;
		} else {
			return fcEvent.title;
		}
	},

	caption: function() {
		$("#caption").empty();
		chambresPourCalendrier.each(function(Chambre) {

			$("#caption").append("<div id='popover" + Chambre.id +
					"' class='span1' rel='popover'  style='background-color:" +
					couleurs[Chambre.id]+"; width:50px; height:30px;'></div>");
			var title ='Chambre '+ Chambre.id;
			var content = "	<b>PrixParjour </b>: "+ Chambre.get('prixParJour') +
			"<br> <b>Nombre de lit simple</b> : " +	Chambre.get('litSimple') +
			"<br> <b>Nombre de lit double</b> : " +	Chambre.get('litDouble') +
			"<br> <b>Nombre de lit jumeau</b> : " + Chambre.get('litJumeau');

			$("#popover" + Chambre.id).popover({
				title: title, content: content, trigger: 'hover',
				html: true, placement: 'top'
			});
		});
	},

	renderList: function() {
		$('#roomSelect1').empty();
		chambresPourCalendrier.each(function(room) {
			$('#roomSelect1').append('<option value="' + room.get('id') +
				'"> Chambre ' +  room.get('id') + '</option>');
		});
	},

	updateOnServer: function() {
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-resa.json"));
		updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()), function(reponse) {
			if (!reponse.error) {
				console.log("réservations mises à jour sur le serveur"); 
			} else {
				console.log("les réservations n'ont pas pu être mises à jour sur le serveur"); 
			}
		});
	}

});

window.EventView = Backbone.View.extend({
	events: {
		'click #addRoom' : 'addRoomForResa',
		'click #removeRoom' : 'removeRoomForResa',
		'focus #rooms select' : 'storeOldValue',
		'change #rooms select' : 'updateRoomOptions',
		'click #btnFicheSejour' : 'btnFicheSejour'
	},
	nbRoomSelects: 1,

	initialize: function() {
		_.bindAll(this);
		initResaDialog();
	},

	render: function() {
		var isNewModel = this.model.isNew();
		var buttons = {'Ok': {text: 'Ok', click: this.addResas,
			class: "btn btn-primary"}};
		if (!isNewModel) {
			_.extend(buttons, {'Delete': {text: 'Delete',
				click: this.destroy, class: 'btn'}});
		}
		_.extend(buttons, {'Cancel': {text: 'Cancel',
			click: this.close, class: 'btn'}});

		this.resetFormClasses();
		this.$el.dialog({
			//modal: true,
			title: (isNewModel ? 'New' : 'Edit') + ' Event',
			buttons: buttons,
			open: this.open
		});
		$('body').addClass('unselectCanceled');

		return this;
	},

	open: function() {
		// enlevé pour faciliter les tests 
		//validateForm.getField('lastName').val(this.model.get('lastName'));
		//validateForm.getField('firstName').val(this.model.get('firstName'));
		var lastName = this.model.get('lastName');
		var firstName = this.model.get('firstName');
		if (lastName) {
			validateForm.getField('lastName').val(lastName);
			validateForm.getField('firstName').val(firstName);
		}
		else {
			validateForm.getField('firstName').val('Ernest');
			validateForm.getField('lastName').val('Le Marcassin');
		}

		validateForm.getField('phone').val(this.model.get('phone'));
		validateForm.getField('email').val(this.model.get('email'));
		$('#roomSelect1').val(this.model.get('room'));
		var nbPersons = this.model.get('nbPersons');
		validateForm.getField('nbPersons').val(nbPersons ? nbPersons : 1);
	},

	newAttributes: function(selectNum) {
		//if (!this.commonResaAttrs) {
		var email = validateForm.getField('email').val(),
			room = $('#roomSelect' + selectNum + ' :selected').val();
		return {
			title: '',
			lastName: validateForm.getField('lastName').val(),
			firstName: validateForm.getField('firstName').val(),
			phone: validateForm.getField('phone').val(),
			email: (email.length > 0) ? email : '',
			nbPersons: validateForm.getField('nbPersons').val(),
			room: room,
			color: couleurs[room]
		};
	},

	addResas: function() {
		if (!$('#resa-form').validate().form()) {
			return;
		}
		var i,
			initialStartDate = this.model.get('start'),
			initialEndDate = this.model.get('end');

		this.model.set(this.newAttributes(1));
		this.save();

		for (i = 2; i <= this.nbRoomSelects; i++) {
			this.model = new Reservation(this.newAttributes(i));
			this.model.set({ start: initialStartDate, end: initialEndDate });
			console.log(this.model);
			this.save();
		}
	},

	save: function() {
		if (this.model.isNew()) {
			console.log("nouvelle réservation détectée");
			this.model.set({ id: this.collection.nextId() });

			var self = this;
			this.model.save(null, {
				success: function() {
					self.collection.add(self.model);
					self.close();

					var obj = JSON.parse(localStorage.getItem("fichier-backbone-resa.json"));
					updateFile(obj.idFichier, JSON.stringify(self.collection.toJSON()), function(reponse) {	
						if (!reponse.error) {
							console.log("réservation sauvegardée sur le serveur");
						}
					});
				},
				error: function() {
					console.log("une erreur s'est produite lors de la sauvegarde dans le cache");
					self.close();
				}
			});

		} else {
			console.log("édition de réservation");
			var self = this;

			this.model.save({}, {success: this.close});
			var obj = JSON.parse(localStorage.getItem("fichier-backbone-resa.json"));
			updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()), function(reponse) {
				if (!reponse.error) {
					console.log("réservation sauvegardée sur le serveur");
				}
			});
		}
	},

	close: function() {
		$('body').removeClass('unselectCanceled');
		this.$el.dialog('close');
	},
	destroy: function() {
		this.model.destroy({success: this.close});
	},
	btnFicheSejour: function() {
		app.navigate('ficheSejour/' + this.model.id, {trigger: true});
		this.$el.dialog('close');
	},
	resetFormClasses: function() {
		var form = $('#resa-form');
		form.validate().resetForm();
		form.find('.success').removeClass('success');
		form.find('.error').removeClass('error');
		form.find('.valid').removeClass('valid');
	},

	// Remove the option tags corresponding to room "room" except in
	// the "excepted" select
	removeRoomOpt: function(room, excepted) {
		var i;
		for (i = 1; i <= this.nbRoomSelects; i++) {
			if (i != excepted) {
				$('#roomSelect' + i + ' option[value=' + room + ']').remove();
			}
		}
	},
	addRoomOpt: function(room, excepted) {
		var i;
		for (i = 1; i <= this.nbRoomSelects; i++) {
			if (i != excepted) {
				$('#roomSelect' + i).append(
		     		$('<option></option>')
		     			.attr('value', room)
		     			.text('Chambre ' + room)
			     );
			}
		}
	},
	storeOldValue: function(e) {
		var select = e.currentTarget;
		select.previous = select.value;
	},
	updateRoomOptions: function(e) {
		var i,
			select = e.currentTarget,
			$select = $(select),
			idSelect = $select.attr('id'),
			excepted = idSelect.charAt(idSelect.length - 1),
			selectedRoom = $select.val();

			this.removeRoomOpt(selectedRoom, excepted);
			this.addRoomOpt(select.previous, excepted);
	},
	updateSelectIds: function() {
		var i = 1;
		$('#rooms select').each(function(index, select) {
			$(select).attr('id', 'roomSelect' + i);
			i++;
		});
	},
	addRoomForResa: function(e) {
		e.preventDefault();
		if (this.nbRoomSelects >= this.nbRooms) {
			return;
		}
		var i, unselectedRooms, alrdySelected = [];

		for (i = 1; i <= this.nbRoomSelects; i++) {
			alrdySelected.push(parseInt($('#roomSelect' + i).val()));
		}
		unselectedRooms =
			_.reject(chambresPourCalendrier.pluck('id'), function(idRoom) {
				return $.inArray(idRoom, alrdySelected) !== -1;
			});

		this.nbRoomSelects++;
		
		var roomRow = _.template(tpl.get('RoomForResaView'), {
			idSelect: this.nbRoomSelects, rooms: unselectedRooms
		});
		this.removeRoomOpt(unselectedRooms[0]);
		$('#rooms').append(roomRow);
	},
	removeRoomForResa: function(e) {
		e.preventDefault();
		var select = $(e.currentTarget).prev(),
			idRoom = select.val();

		select.closest('.row-fluid').remove();
		this.nbRoomSelects--;
		this.updateSelectIds();
		this.addRoomOpt(idRoom);
	}
});

function getBodyPad() {
	var body = $("body");
	return parseInt(body.css("padding-top").replace("px", "")) +
	parseInt(body.css("padding-bottom").replace("px", ""));
}

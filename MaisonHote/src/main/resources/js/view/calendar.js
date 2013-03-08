window.CalendarView = Backbone.View.extend({
	initialize: function () {
		// initialisation de la vue
		console.log('Calendar view initialized !'); 
		$(this.el).html(_.template(tpl.get('CalendarView')));
	}
});

window.EventsView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this); 

		this.collection.bind('reset', this.addAll);
		this.collection.bind('add', this.addOne);
		this.collection.bind('change', this.change);            
		this.collection.bind('destroy', this.destroy);

		this.eventView = new EventView({el: $('#eventDialog')});
		chambresPourCalendrier.bind('replace reset add remove', this.caption);  
		chambresPourCalendrier.fetch(); //si on refresh la page ça va chercher les chambres dans le localstorage
	},
	render: function() {
		$(this.el).fullCalendar({
			header: {
				left: 'prev,next', // 'prev,next today',
				center: 'title',
				right: 'basicWeek,month'
			},
			selectable: true,
			unselectCancel: ".unselectCanceled",
			editable: true,
			ignoreTimezone: false,
			firstDay: 1,
			select: this.select,
			eventClick: this.eventClick,
			eventDrop: this.eventDropOrResize,
			eventResize: this.eventDropOrResize,
			height: getWindowHeight() - getBodyPad(),
			roomsNb: 3,
			roomColWidth: 0.1,
			rowHeightForEvents: true
			/* impossible
			roomNames: {first: "Chambre 1", snd: "Chambre 2", third: "Chambre 3"},
			roomNames: ["Chambre 1", "Chambre 2", "Chambre 3"]
			 */
		});
	},
	addAll: function() {
		this.$el.fullCalendar('addEventSource', this.collection.toJSON(), true);
	},
	addOne: function(event) {
		this.$el.fullCalendar('renderEvent', event.toJSON(), true);
	},        
	select: function(startDate, endDate) {
		this.eventView.collection = this.collection;
		this.eventView.model = new Reservation({start: startDate, end: endDate});
		//this.eventView.model.bind('invalid', this.eventView.onError);
		this.eventView.render();
	},
	eventClick: function(fcEvent) {
		// utiliser l'id lorsque ce sera sauvegard�, pas firstName
		this.eventView.model = this.collection.get(fcEvent.id);
		//this.eventView.model = this.collection.where({firstName: fcEvent.firstName})[0];
		this.eventView.render();
	},
	change: function(event) {
		// Look up the underlying event in the calendar and update its details from the model
		var fcEvent = this.$el.fullCalendar('clientEvents', event.get('id'))[0];
		fcEvent.title = event.get('room');
		//fcEvent.color = event.get('color');
		this.$el.fullCalendar('updateEvent', fcEvent, true);           
	},
	eventDropOrResize: function(fcEvent) {
		// Lookup the model that has the ID of the event and update its attributes
		this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});
		
		var text = "Veuillez sauvegarder pour que vos modifications soient prises en compte sur le serveur <i id='infoSave' class='icon-info-sign' data-toggle='tooltip'></i>";
		var contentSaveForm = "<div class='control-group'><label class='control-label'>"+text+"</label>"+
				   "<div class='controls'><button type='submit' id='submit' class='btn btn-warning'>Enregistrer</button></div></div></div>"; 
		
		$('#calendar').before("<div class='row'> <div class='span4 offset4 text-center'>"+ contentSaveForm +"</div></div>");
		$('#infoSave').tooltip({'title' : 'Si vous ne sauvegardez pas, vos modifications ne seront pas prises en compte lors de votre prochaine connexion'})
		console.log("il faut sauvegarder sur le serveur");
	},
	destroy: function(event) {
		this.$el.fullCalendar('removeEvents', event.id, true);         
	},
	

	caption : function(){
		$('#caption').empty();
		chambresPourCalendrier.each(function(Chambre){

			$('#caption').append("<div id='popover"+ Chambre.id +"' class='span1' rel='popover'  style='background-color:"+ couleurs[Chambre.id]+";'></div>");
			var title ='Chambre '+Chambre.id;
			var content = "	<b>PrixParjour </b>: "+Chambre.get('prixParJour')+"<br> <b>Nombre de lit simple</b> : "+Chambre.get('litSimple')+"<br> <b>Nombre de lit double</b> : "+Chambre.get('litDouble')+"<br> <b>Nombre de lit jumeau</b> : "+Chambre.get('litJumeau');			
			
			$("#popover"+Chambre.id).popover({ title: title, content: content, trigger: 'hover' , html:true, placement: 'top'});
		});

	}
});

window.EventView = Backbone.View.extend({
	events : {
		"click #btnFicheSejour" : "btnFicheSejour"
	},
	initialize: function() {
		_.bindAll(this);
		initResaDialog();
	},

	render: function() {
		var isNewModel = this.model.isNew();
		var buttons = {'Ok' : {text: 'Ok', click: this.save,
			class: "btn btn-primary"}};
		if (!isNewModel) {
			_.extend(buttons, {'Delete': {text: 'Delete',
				click: this.destroy, class: "btn"}});
		}
		_.extend(buttons, {'Cancel': {text: 'Cancel',
			click: this.close, class: "btn"}});            

		this.resetFormClasses();
		this.$el.dialog({
			modal: true,
			title: (isNewModel ? 'New' : 'Edit') + ' Event',
			buttons: buttons,
			open: this.open
		});
		$('body').addClass("unselectCanceled");

		return this;
	},

	open: function() {
		validateForm.getField('lastName').val(this.model.get('lastName'));
		validateForm.getField('firstName').val(this.model.get('firstName'));
		validateForm.getField('phone').val(this.model.get('phone'));
		validateForm.getField('email').val(this.model.get('email'));
		validateForm.getField('room').val(this.model.get('room'));
		validateForm.getField('nbPersons').val(this.model.get('nbPersons'));
	},

	save: function() {
		if ( !$('#resa-form').validate().form())
			return;

		var lastName = validateForm.getField('lastName').val();
		var firstName = validateForm.getField('firstName').val();
		var phone = validateForm.getField('phone').val();
		var email = validateForm.getField('email').val();
		var room = validateForm.getField('room').val();
		var nbPersons = validateForm.getField('nbPersons').val();

		this.model.set({
			'title': "Chambre " + room + " | " + lastName,
			'lastName': lastName,
			'firstName': firstName,
			'phone': phone,
			'email': (email.length > 0) ? email : '',
					'room': room,
					'nbPersons': nbPersons});

		if (this.model.isNew()) {
			console.log("nouvelle réservation détectée");
			this.model.set({'id': this.collection.nextId()});

			var self = this;

			this.model.save(null,{
				success: function() {
					self.collection.add(self.model);
					self.close();

					var obj = JSON.parse(localStorage.getItem("fichier-backbone-resa.json"));
					updateFile(obj.idFichier, JSON.stringify(self.collection.toJSON() ),function(reponse){	
						if (!reponse.error){
							console.log("réservation sauvegardée sur le serveur");
						}
					});


				},
				error : function() {
					console.log("une erreur s'est produite lors de la sauvegarde dans le cache");
					self.close();
				}
			});


		} else {
			console.log("edition de réservation");
			this.model.save({}, {success: this.close});
		}
	},
	close: function() {
		$('body').removeClass("unselectCanceled");
		this.$el.dialog('close');
	},
	destroy: function() {
		this.model.destroy({success: this.close});
	},
	btnFicheSejour: function() {
		app.ficheSejour();
		this.$el.dialog('close');
	},
	resetFormClasses: function() {
		var form = $('#resa-form');
		form.validate().resetForm();
		form.find('.success').removeClass('success');
		form.find('.error').removeClass('error');
		form.find('.valid').removeClass('valid');
	}
});

function getWindowHeight() {
	if (window.innerHeight) { 
		//Other than IE
		var winHeight = window.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight) {
		//IE standard mode
		var winHeight = document.documentElement.clientHeight;
	}
	else if (document.body && document.body.clientHeight) {
		//IE quirks mode
		var winHeight = document.body.clientHeight;
	}
	return winHeight;
}

function getBodyPad() {
	var body = $('body');
	return parseInt(body.css('padding-top').replace('px', '')) +
	parseInt(body.css('padding-bottom').replace('px', ''));
}

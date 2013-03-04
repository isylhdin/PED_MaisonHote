window.CalendarView = Backbone.View.extend({
	initialize: function () {
		// initialisation de la vue
		console.log('Main view initialized !'); 
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
		//this.eventView.model.bind('error', this.eventView.onError);
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
		// il faut utiliser l'id, pour le moment �a ne marche pas
		// Lookup the model that has the ID of the event and update its attributes
		//$(this.collection).get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});            
	},
	destroy: function(event) {
		this.$el.fullCalendar('removeEvents', event.id, true);         
	}
});

window.EventView = Backbone.View.extend({
	events : {
		"focus input"	: "onInputGetFocus",
		"click #btnFicheSejour" : "btnFicheSejour"
	},
	initialize: function() {
		_.bindAll(this);
		addResaDialogWidgets();
	},

	render: function() {
		var buttons = {'Ok': this.save};
		if (!this.model.isNew()) {
			_.extend(buttons, {'Delete': this.destroy});
		}
		_.extend(buttons, {'Cancel': this.close});            

		this.$el.dialog({
			modal: true,
			title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
			buttons: buttons,
			open: this.open
		});
		$('body').addClass("unselectCanceled");

		return this;
	},        
	open: function() {
		validateForm.getField('lastName').val(this.model.get('lastName'));
		/*validateForm.getField('lastName').val(this.model.get('lastName'));
		validateForm.getField('firstName').val(this.model.get('firstName'));
		validateForm.getField('phone').val(this.model.get('phone'));
		validateForm.getField('room').val(this.model.get('room'));
		validateForm.getField('nbPersons').val(this.model.get('nbPersons'));*/
	},

	save: function() {
		/*if (!attrs.lastName.length) errors.push('lastName');
		if (!attrs.firstName.length) errors.push('firstName');
		if (!attrs.phone.length) errors.push('phone');
		if (!attrs.room.length) errors.push('room');
		if (errors.length) return errors;*/
		
		var room = validateForm.getField('room').val();
		var lastName = validateForm.getField('lastName').val();
		var firstName = validateForm.getField('firstName').val();
		var phone = validateForm.getField('phone').val();
		var room = validateForm.getField('room').val();
		var nbPersons = validateForm.getField('nbPersons').val();

		this.model.set({
			'title': "Chambre " + room + " | " + lastName,
			'lastName': lastName,
			'firstName': firstName,
			'phone': phone,
			'room': room,
			'nbPersons': nbPersons});

		if (this.model.isNew()) {
			this.collection.create(this.model, {success: this.close});
		} else {
			this.model.save({}, {success: this.close});
		}

		// a supprimer quand on aura sauvegard� sur le serveur
		// comme �a ne ferme que lorsque c'est sauvegard�
		//this.close();
	},
	/*onError: function(model, error) {
		_.each(error, function(fieldName) {
			this.setFieldError(fieldName);
		}, this);
	},*/
	/*
	onError: function(model, error) {
		 success = window.validateForm.onError(model, error, this);
	},
	onInputGetFocus: function(e) {
		 window.validateForm.onInputGetFocus(e);
	},*/

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
/*
	setFieldError: function(fieldName) {
		var $controlGroup = this.getFieldControlGroup(this.getField(fieldName));
		$controlGroup.addClass('error');
	},*/
	getField: function(fieldName) {
		return $('input[name='+fieldName+']');
	}/*,
	getFieldControlGroup: function($field) {
		return $field.parents('.control-group');
	}*/
});

////Reservations
//events = new Events();
////Un calendrier possède un ensemble de réservations
//calendar = new EventsView({el: $("#calendar"), collection: events}).render();
//events.fetch();

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

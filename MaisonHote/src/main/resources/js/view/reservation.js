window.ReservationView = Backbone.View.extend({
	events: {
		'click #addRoom' : 'addRoomForResa',
		'click #removeRoom' : 'removeRoomForResa',
		'focus #rooms select' : 'storeOldValue',
		'change #rooms select' : 'updateRoomOptions',
		'change #prestaSelect' : 'addPresta',
		'click #removePresta' : 'removePresta',
		'click #btnFicheSejour' : 'btnFicheSejour',
		'click #client' : 'renderTypeaheadList',
		'keypress input[name=client]' : 'checkValidClient'
	},
	nbRoomSelects: 1,

	initialize: function() {
		_.bindAll(this);
		this.initDialog();
		prestasPourCalendrier.bind('replace reset add remove', this.renderPrestaList);
		prestasPourCalendrier.fetch();

		customersResa.fetch();
	},

	render: function() {
		var isNewModel = this.model.isNew();
		var buttons = {'Ok': {text: 'Ok', click: this.addResas,
			class: 'btn btn-primary'}};
		if (!isNewModel) {
			_.extend(buttons, {'Delete': {text: 'Delete',
				click: this.destroy, class: 'btn'}});
			$('#btnFicheSejour').removeAttr("disabled");
		}
		_.extend(buttons, {'Cancel': {text: 'Cancel',
			click: this.close, class: 'btn'}});

		this.resetFormClasses();
		this.$el.dialog({
			//modal: true,
			title: (isNewModel ? 'New' : 'Edit') + ' Reservation',
			buttons: buttons,
			open: this.open
		});
		$('body').addClass('unselectCanceled');

		return this;
	},

	renderPrestaList: function() {
		$('#prestaSelect').empty();
		prestasPourCalendrier.each(function(presta) {
			$('#prestaSelect').append('<option value="' + presta.get('id') +
					'">' +  presta.get('title') + '</option>');
		});
	},

	initDialog: function() {
		$("input[name=nbPersons]").spinner({min: 1});

		jQuery.validator.addMethod('nbPersons', function(value, element) {
			return value > 0;
		}, 'The number of persons must be positive');

		jQuery.validator.addMethod('phone', function(value, element) {
			if (value.length == 0) {
				return true;
			}
			return /^0\d \d\d \d\d \d\d \d\d$/i.test(value);
		}, 'Expected phone number format: <i>0X XX XX XX XX</i>');

		$('#resa-form').validate({
			rules: {
				client: {
					required: true
				},
				room: {
					required: true
				}
			},
			highlight: function(element) {
				$(element).closest('.control-group').removeClass('success').addClass('error');
			},
			success: function(element) {
				element.text('OK!').addClass('valid')
				.closest('.control-group').removeClass('error').addClass('success');
			}
		});
	},

	open: function() {
		$("input").blur();
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
//			validateForm.getField('firstName').val('Ernest');
//			validateForm.getField('lastName').val('Le Marcassin');
		}

		validateForm.getField('phone').val(this.model.get('phone'));
		validateForm.getField('email').val(this.model.get('email'));
		$('#roomSelect1').val(this.model.get('room'));
		var nbPersons = this.model.get('nbPersons');
		validateForm.getField('nbPersons').val(nbPersons ? nbPersons : 1);
	},

	newAttributes: function(selectNum, idResaGroup) {
		var email = validateForm.getField('email').val(),
		room = $('#roomSelect' + selectNum + ' :selected').val();
		
		var idClient = findClient(validateForm.getField('client').val());
		console.log(idClient);
		
		return {
			idResaGroup: idResaGroup,
			idClient: idClient,
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
		initialEndDate = this.model.get('end'),
		idResaGroup = this.collection.nextGroupId();

		this.model.set(this.newAttributes(1, idResaGroup));
		this.save();

		for (i = 2; i <= this.nbRoomSelects; i++) {
			this.model = new Reservation(this.newAttributes(i, idResaGroup));
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
		var $select = $(e.currentTarget).prev(),
		idRoom = $select.val();

		$select.closest('.row-fluid').remove();
		this.nbRoomSelects--;
		this.updateSelectIds();
		this.addRoomOpt(idRoom);
	},

//	TODO: Améliorer les input (bootstrap...) et mettre --- en début de select
	addPresta: function(e) {
		var $prestaOpt = $(e.currentTarget).find('option:selected'),
		prestaId = $prestaOpt.attr('value'),
		prestaTitle = $prestaOpt.val(),
		prestaRow = _.template(tpl.get('PrestaForResaView'), {
			id: prestaId, title: prestaTitle
		});
		$prestaOpt.remove();
		$('#prestas').append(prestaRow);
	},

	removePresta: function(e) {
		var $prestaField = $(e.currentTarget).prev(),
		$prestaRow = $prestaField.closest('.row-fluid'),
		prestaId = $prestaField.attr('value'),
		prestaTitle = $prestaField.val();
		$('#prestaSelect').append(
				$('<option></option>')
				.attr('value', prestaId)
				.text(prestaTitle)
		);
		$prestaRow.remove();
	},

	renderTypeaheadList: function() {

		window.namesArray = new Array();
		if(customersResa!=null)
		{
			customersResa.each(function(Customer){        		
				namesArray.push( Customer.get('name') + ' ' + Customer.get('firstname'));
			});
		}
		$('#client').typeahead({ 
			source: namesArray,

			updater: function(selection){
				$('#selectedClient').html(selection);
				return selection;
			}
		}) ;
	},

	checkValidClient: function(){
		setTimeout(function() {
			var value =$('#client').val();

			if ($('.typeahead').length){
				if($('.typeahead').css('display') == 'none' && value != ''){
					$('#client').css('background-color', '#FE705A');
				}else{
					$('#client').css('background-color', '');
				}
			}else{
				if(value != ''){
					$('#client').css('background-color', '#FE705A');
				}
				else{
					$('#client').css('background-color', '');
				}
			}
		}, 150); //laisser à ce temps, sinon la div du typeahead n'a pas encore été crée
	}
	
});

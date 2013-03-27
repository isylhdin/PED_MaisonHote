window.ReservationView = Backbone.View.extend({
	events: {
		'click #addRoom' : 'addRoomForResa',
		'click #removeRoom' : 'removeRoomForResa',
		'focus #rooms select' : 'storeOldValue',
		'change #rooms select' : 'updateRoomOptions',
		'change #prestaSelect' : 'addPresta',
		'click #removePresta' : 'removePresta',
		'click #decrPresta' : 'decrPresta',
		'click #incrPresta' : 'incrPresta',
		'click #btnFicheSejour' : 'btnFicheSejour',
		'click #client' : 'renderTypeaheadList',
		'keypress input[name=client]' : 'checkValidClient',
		'click #deleteSelection' : 'deleteSelection'
	},

	initialize: function() {
		_.bindAll(this);
		this.initDialog();
		this.listenTo(chambresPourCalendrier, 'replace reset add remove',
			this.renderRoomList);
		this.listenTo(prestasPourCalendrier, 'replace reset add remove',
			this.renderPrestaList);

		customersResa.fetch();

		window.clientMatched = 0;
	},

	render: function() {
		var isNewModel = this.model.isNew();
		var buttons = {'Ok': {text: 'Ok', click: this.addResas,
			class: 'btn btn-primary'}};
		if (!isNewModel) {
			_.extend(buttons, {'Delete': {text: 'Delete',
				click: this.destroy, class: 'btn'}});
			$('#btnFicheSejour').removeAttr('disabled');
		}
		_.extend(buttons, {'Cancel': {text: 'Cancel',
			click: this.closeDialog, class: 'btn'}});

		this.resetFormClasses();
		this.$el.dialog({
			modal: true,
			title: (isNewModel ? 'New' : 'Edit') + ' Reservation',
			buttons: buttons,
			open: this.open(isNewModel)
		});
		$('.ui-widget-overlay').css('background', 'transparent');
		//$('body').addClass('unselectCanceled');
		$('input').blur();
		return this;
	},

	renderRoomList: function() {
		//console.log("-renderList: " + chambresPourCalendrier.length);
		var $select = $('#roomSelect1');

		this.nbRooms = chambresPourCalendrier.length;
		$select.empty();
		chambresPourCalendrier.each(function(room) {

			$select.append('<option value="' + room.get('id') +
					'"> Chambre ' +  room.get('id') + '</option>');

		});
	},

	renderPrestaList: function() {
		//console.log("-renderPrestaList " + prestasPourCalendrier.length);
		var $select = $('#prestaSelect');

		$select.empty().append('<option selected></option>');
		prestasPourCalendrier.each(function(presta) {
			$select.append('<option value="' + presta.get('id') +
					'">' +  presta.get('title') + '</option>');
		});
	},

	initDialog: function() {
		$('input[name=nbPersons]').spinner({ min: 1 });

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
				$(element).closest('.control-group').removeClass('success').
					addClass('error');
			},
			success: function(element) {
				element.text('OK!').addClass('valid').
					closest('.control-group').removeClass('error').
					addClass('success');
			}
		});
	},

	open: function(isNewModel) {		
		this.nbRoomSelects = 1;
		this.clearResa();

		if (!isNewModel) {
			this.openExistingResa(this.model);
		}

		var arrhes = this.model.get('arrhes'),
			nbPersons = this.model.get('nbPersons');

		$('input[name=arrhes]').prop('checked', arrhes);
		validateForm.getField('nbPersons').val(nbPersons ? nbPersons : 1);
	},

	clearResa: function() {
		this.resetFormClasses();
		$('#client').css('background-color', '');
		$('#addRoom').removeAttr('disabled');
		this.deleteSelection();

		var save = $('#rooms div:first').detach();
		$('#rooms').empty().append(save);

		this.renderRoomList();
		this.renderPrestaList();
	},

	openExistingResa: function(model) {
		this.resetFormClasses();

		var idClient = model.get('idClient'),
			client = customersResa.get(idClient),
			name = client.attributes.name,
			firstname = client.attributes.firstname,
			concatenatedName = name + ' ' + firstname;

		$('#client').val(concatenatedName);
		$('#selectedClient').html(concatenatedName +
			' <i id="deleteSelection" class="icon-remove-sign" ' +
			'data-toggle="tooltip"></i>');
		$('#deleteSelection').tooltip({
			'title' : 'Supprimer sélection'
		});
		
		var idResaGroup = model.get('idResaGroup'),
			resaGroup = getAllResaFromGroup(idResaGroup);

		$('#roomSelect1').val(resaGroup[0].get('room'));
		if (resaGroup.length > 1) {
			for (var i = 1; i < resaGroup.length; i++) {
				this.addRoomForResa();
				$('#roomSelect' + eval(i + 1)).val(resaGroup[i].get('room'));
			}		
		}

		var orderedPrestas = resaGroupsPrestas.get(idResaGroup);
		if (orderedPrestas) {
			var prestas = orderedPrestas.get('prestas'),
				prestaTitle,
				$prestaOpt,
				quantity;

			for (var idPresta in prestas) {
				$prestaOpt =
					$('#prestaSelect').find('option[value=' + idPresta + ']');
				prestaTitle = prestasPourCalendrier.get(idPresta).get('title');
				quantity = prestas[idPresta];
				this.addPrestaTag(idPresta, prestaTitle, quantity, $prestaOpt);
			}
		}
	},

	// TODO: faire que la recherche des attributs soit moins éparpillée et
	// que tous les attributs communs ne soient recherchés qu'une fois
	newAttributes: function(selectNum, idResaGroup) {
		var	room = $('#roomSelect' + selectNum + ' :selected').val(),
			idClient = findClient(validateForm.getField('client').val()),
			arrhes = $('input[name=arrhes]').is(':checked');

		return {
			idResaGroup: idResaGroup,
			idClient: idClient,
			nbPersons: validateForm.getField('nbPersons').val(),
			room: room,
			color: couleurs[room],
			arrhes: arrhes
		};
	},

	addResas: function() {
		if (!$('#resa-form').validate().form()) {
			return;
		}
		var i,
			idPresta,
			nbPresta,
			initialStartDate = this.model.get('start'),
			initialEndDate = this.model.get('end'),
			idResaGroup = this.collection.nextGroupId();

		window.orderedPrestas = resaGroupsPrestas.at(idResaGroup);

		if (!orderedPrestas) {
			orderedPrestas = new ResaGroupPrestas({
				idResaGroup: idResaGroup
			});
			orderedPrestas.set('idResaGroup', idResaGroup);
			resaGroupsPrestas.add(orderedPrestas);
		}
		orderedPrestas.set('prestas', {});

		console.log(orderedPrestas.get('prestas'));
		$('#prestas').find('[idPresta]').each(function(index, element) {
			idPresta = $(element).attr('idPresta');
			nbPresta = $('#nbPresta' + idPresta).text();
			orderedPrestas.setPresta(idPresta, nbPresta);
		});

		this.model.set(this.newAttributes(1, idResaGroup));
		this.save();

		for (i = 2; i <= this.nbRoomSelects; i++) {
			this.model = new Reservation(this.newAttributes(i, idResaGroup));
			this.model.set({ start: initialStartDate, end: initialEndDate });
			this.save();
		}
	},

	/**
	 * Sauvegarde la réservation dans le cache et sur le serveur.
	 * On distingue 2 types de réservations : 
	 * - la nouvelle réservation
	 * - la réservation existante qu'on veut éditer
	 */
	save: function() {
		if (this.model.isNew()) {
			console.log('nouvelle réservation détectée');
			this.model.set({ id: this.collection.nextId() });

			var self = this;
			this.model.save(null, {
				success: function() {
					self.collection.add(self.model);
					self.closeDialog();

					var obj = JSON.parse(localStorage.getItem(
							'fichier-backbone-resa.json'));

					updateFile(obj.idFichier,
							JSON.stringify(self.collection.toJSON()),
							function(reponse) {
						if (!reponse.error) {
							console.log(
								'réservation sauvegardée sur le serveur');
						}
					});		

					orderedPrestas.save();
					obj = JSON.parse(localStorage.getItem(
						'fichier-backbone-ordered_prestas.json'));
					updateFile(obj.idFichier,
							JSON.stringify(resaGroupsPrestas.toJSON()),
							function(reponse) {	
						if (!reponse.error) {
							console.log('prestas de la réservation ' +
								'sauvegardées sur le serveur');
						}
					});
				},
				error: function() {
					console.log('une erreur s\'est produite lors de la ' +
						'sauvegarde dans le cache');
					self.closeDialog();
				}
			});

		} else {
			console.log('édition de réservation');
			var self = this;

			this.model.save({}, { success: this.closeDialog });
			var obj = JSON.parse(localStorage.getItem(
					'fichier-backbone-resa.json'));
			updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()),
					function(reponse) {
				if (!reponse.error) {
					console.log('réservation sauvegardée sur le serveur');
				}
			});

			orderedPrestas.save();
			obj = JSON.parse(localStorage.getItem(
				'fichier-backbone-ordered_prestas.json'));

			updateFile(obj.idFichier,
					JSON.stringify(resaGroupsPrestas.toJSON()),
					function(reponse) {
				if (!reponse.error) {
					console.log(
						'prestas de la resa sauvegardée sur le serveur');
				}
			});
		}
	},

	closeDialog: function() {
		$('#prestas').find('.prestaRow').remove();
		//$('body').removeClass('unselectCanceled');
		this.$el.dialog('close');
	},

	destroy: function() {
		this.model.destroy({success: this.closeDialog});
	},

	btnFicheSejour: function() {
		app.navigate('ficheSejour/' + this.model.id, { trigger: true });
		this.$el.dialog('close');
	},

	resetFormClasses: function() {
		var form = $('#resa-form');
		form.validate().resetForm();
		form.find('.success').removeClass('success');
		form.find('.error').removeClass('error');
		form.find('.valid').removeClass('valid');
	},

	/**
	 *  Remove the option tags corresponding to room "room" except in
	 *  the "excepted" select
	 */
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
		if (e != null) {
			e.preventDefault();
		}

		if (this.nbRoomSelects >= this.nbRooms) {
			$('#addRoom').attr("disabled", "disabled");;
			return;
		}

		var i, unselectedRooms, alrdySelected = [];

		for (i = 1; i <= this.nbRoomSelects; i++) {
			alrdySelected.push(
				parseInt($('#roomSelect' + i + ' :selected').val()));
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

		$('#addRoom').removeAttr('disabled');
	},

	addPresta: function(e) {
		var $prestaOpt = $(e.currentTarget).find('option:selected'),
			idPresta = $prestaOpt.val(),
			prestaTitle = $prestaOpt.text();

		this.addPrestaTag(idPresta, prestaTitle, 1, $prestaOpt);
	},

	addPrestaTag: function(idPresta, prestaTitle, quantity, $prestaOpt) {
		prestaRow = _.template(tpl.get('PrestaForResaView'), {
			id: idPresta, title: prestaTitle, nb: quantity
		});
		$prestaOpt.remove();
		$('#prestas').append(prestaRow);
	},

	removePresta: function(e) {
		var prestaTagId = $(e.currentTarget).attr('idPrestaTag'),
			$prestaTag = $('#' + prestaTagId),
			prestaId = $prestaTag.attr('idPresta'),
			prestaTitle = $prestaTag.text(),
			$prestaRow = $prestaTag.closest('.row-fluid');

		$('#prestaSelect').append(
			$('<option></option>')
				.attr('value', prestaId)
				.text(prestaTitle)
		);
		$prestaRow.remove();
	},

//	TODO: supprimer la duplication de code
	incrPresta: function(e) {
		var prestaNbId = $(e.currentTarget).attr('idNbPresta'),
			$prestaNb = $('#' + prestaNbId),
			prestaNb = parseInt($prestaNb.text());

		$prestaNb.text(prestaNb + 1);
	},

	decrPresta: function(e) {
		var prestaNbId = $(e.currentTarget).attr('idNbPresta'),
			$prestaNb = $('#' + prestaNbId),
			prestaNb = parseInt($prestaNb.text());

		if (prestaNb > 1) {
			$prestaNb.text(prestaNb - 1);
		}
	},

	/**
	 * Construit l'input typeahead avec les méthodes associées
	 */
	renderTypeaheadList: function() {
		console.log("on a cliqué dans le typeahead");
		window.namesArray = new Array();

		if (customersResa != null) {
			customersResa.each(function(Customer) {        		
				namesArray.push(
					Customer.get('name') + ' ' + Customer.get('firstname'));
			});
		}

		var typeahead = $('#client').data('typeahead');
		console.log(typeahead);
		if (!typeahead) {

			$('#client').typeahead({ 
				source: namesArray,

				matcher: function(item) {
					if (item.toLowerCase().indexOf(
							this.query.trim().toLowerCase()) != -1) {
						clientMatched++;
						return true;
					}
				},

				updater: function(selection) {
					$('#selectedClient').html(selection +
						' <i id="deleteSelection" class="icon-remove-sign"' +
						' data-toggle="tooltip"></i>');
					$('#deleteSelection').tooltip({
						'title' : 'Supprimer sélection'
					});
					return selection;
				}
			}) ;
		}

	},

	/**
	 * supprime le client qu'on a sélectionné dans la pop-up de réservation
	 */
	deleteSelection: function() {
		$('#selectedClient').empty();
		$('#client').val('');
	},

	/**
	 * colore l'input en rouge si aucun client ne correspond à ce qu'on a
	 * rentré
	 */
	checkValidClient: function() {
		clientMatched = 0;
		console.log('avant = ' + clientMatched);

		setTimeout(function() {
			var value = $('#client').val();
			console.log('dedans = '+ clientMatched);

			if (clientMatched > 0 || value === '') {
				console.log('value = '+ value);
				$('#client').css('background-color', '');
			} else {
				$('#client').css('background-color', '#FE705A');
			}
		//laisser à ce temps, sinon la div du typeahead n'a pas encore
		// été crée et la valeur de l'input n'a pas changé
		}, 250);
	}
});

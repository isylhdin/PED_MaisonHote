window.ListCustomerView = Backbone.View.extend({

	idCustomer: null,

	events: {
		//'click #btnSearchCustomer' : 'searchCustomer'
		'click #btnAddCustomer' : 'addCustomer',
		'click #btnClose' : 'closeModal',
		'click #btnSave' : 'saveCustomer',
		'click #btnEditCustomer' : 'showModalCustomer',
		'click #selectCustomer' : 'showCustomer',
		'click #btnDeleteCustomer' : 'deleteCustomer'
	},

	initialize: function() {
		idCustomer = null;
		customers = new Customers();
		customers.localStorage =
			new Backbone.LocalStorage('customers-backbone');
		customers.fetch();
		this.render();
	},

	render: function() {
		var customersData = '<div class="span5"><div class="hero-unit">' +
			'<table class="table"><tr><td>';
		customersData += this.createList();
		customersData +=
        	'</td><td><a id="btnAddCustomer" role="button" class="btn" ' +
        	'data-toggle="modal"><img src="css/img/add_logo.png" width="30" ' +
        	'border="0"/></a><br/><a id="btnEditCustomer" role="button" ' +
        	'class="btn" data-toggle="modal">' +
        	'<img src="css/img/edit_logo.png" width="30" border="0"/></a>' +
        	'<br/><a id="btnDeleteCustomer" role="button" class="btn">' +
        	'<img src="css/img/delete_logo.png" width="30" border="0"/></a>' +
        	'</td></tr></table></div></div><div class="span5">' +
        	'<div id="dataCustomer" class="hero-unit"></div>';

		$(this.el).append(customersData);
		return this;
    },

	reRender: function() {
		$('#selectCustomer').replaceWith(this.createList());
	},

	createList: function() {
		var list = '<select id="selectCustomer" size="10">';
		if (customers != null) {
			customers.each(function(customer) {
				list += '<option value="' + customer.get('id') + '">' +
					customer.get('lastName').toUpperCase() + ' ' +
					customer.get('firstName') + ' (' + customer.get('city') +
					')</option>';
			});
		}
		list += '</select>';
		return list;
	},   

    addCustomer: function() {
		this.template = _.template(tpl.get('DataCustomerView'));
		$('#dataCustomer').before(this.template);
    	
		// vide les infos du modal
		$('#lastName').val('');
		$('#firstName').val('');
		$('#phone').val('');
		$('#address').val('');
		$('#postcode').val('');
		$('#city').val('');
		$('#email').val('');

		$('#customer-form').validate({
			rules: {
				lastName: {
					required: true
				},
				phone: {
					phone: true
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

		$('#myModal').modal('show');
    },

	closeModal: function() {
		this.reRender();
		idCustomer = null ;
		$('#myModal').modal('hide');
	},

	saveCustomer: function() {
		if (!$('#customer-form').validate().form()) {
			return;
		}
		this.saveDataCustomer();
		this.closeModal();
	},

	getNewId: function() {
    	var id = 0;

		if (customers != null) {
	    	customers.each(function(Customer) {
				if (Customer.get('id') > id) {
					id = Customer.get('id');
				}
			});
		}
		id += 1;
		return id;
	},

	saveDataCustomer: function() {		
		// If it's a new customer we have to create it
		var msg2show;

		if (!idCustomer) {
			var newId = this.getNewId();
			customer = new Customer({ 'id': newId });
			customers.add(customer);
			msg2show = 'Nouveau client ajouté avec succès.';
		} else {
			// we search the customer in the collection				
			customer = customers.get(idCustomer);
			msg2show = 'Client modifié avec succès.'
		}

		success = true;

		window.lastName = $('#lastName').val();
		window.firstName = $('#firstName').val();
		window.address = $('#address').val();
		window.postcode = $('#postcode').val();
		window.city = $('#city').val();
		window.phone = $('#phone').val();
		window.email = $('#email').val();

		customer.save({
			'lastName': lastName, 'firstName': firstName, 'address': address,
			'postcode': postcode, 'city': city, 'phone': phone, 'email': email
		}, { silent: true });

		// update file on server
		var obj = JSON.parse(
				localStorage.getItem('fichier-backbone-customers.json'));

		updateFile(obj.idFichier, JSON.stringify(customers.toJSON()),
			function() {});
		document.getElementById('dataCustomer').innerHTML = msg2show;
		this.reRender();
	},

	showCustomer: function() {		
		var idCustomers = document.getElementById('selectCustomer').value,
			customer = JSON.parse(
				localStorage['customers-backbone-' + idCustomers]),
			infos;

		// we load data in the div
		infos = '<address><strong>' +
			customer.lastName.toUpperCase() + ' ' +
			customer.firstName + '</strong><br/>' +
			customer.address + '<br/>' +
			customer.postcode + ' ' + customer.city + '<br/><br/>' +
			customer.phone + '<br/>' +
			'<a href="mailto:#">' + customer.email + '</a><br/></adress>';

		document.getElementById('dataCustomer').innerHTML = infos;
	},

	showModalCustomer : function () {
		if (document.getElementById('selectCustomer').selectedIndex != -1) {
			idCustomer = document.getElementById('selectCustomer').value;
			var customer = JSON.parse(
				localStorage['customers-backbone-' + idCustomer]);
			
			this.template = _.template(tpl.get('DataCustomerView'));
			$('#dataCustomer').before(this.template());
			
			// we load data in the modal and open it
			$('#lastName').val(customer.lastName);
			$('#firstname').val(customer.firstName);
			$('#phone').val(customer.phone);
			$('#address').val(customer.address);
			$('#postcode').val(customer.postcode);
			$('#city').val(customer.city);
			$('#email').val(customer.email);

			$('#myModal').modal('show');
		}
	},

	deleteCustomer: function() {
		if (document.getElementById('selectCustomer').selectedIndex != -1) {
			customer = customers.get(
				document.getElementById('selectCustomer').value);

			localStorage.removeItem('customers-backbone-' +
				customer.get('id'));
			customers.remove(customer);

			var obj = JSON.parse(
				localStorage.getItem('fichier-backbone-customers.json'));

			updateFile(obj.idFichier, JSON.stringify(customers.toJSON()),
				function() {});
			document.getElementById('dataCustomer').innerHTML =
				'Client supprimé avec succès.';
			this.reRender();
		}
	}
});

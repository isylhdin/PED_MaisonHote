window.ListCustomerView = Backbone.View.extend({

	events: {
		//"click #btnSearchCustomer"   : "searchCustomer"
		"click #btnAddCustomer": "addCustomer",
		"click #btnClose" : "closeModal",
		"click #btnSave" : "saveCustomer",
		"click #selectCustomer" : "showCustomer"
	},

    initialize: function () {
    	customers = new Customers();
		customers.localStorage = new Backbone.LocalStorage("customers-backbone");
		customers.fetch();
        this.render();
    },

    render: function () {
       //$(this.el).html(_.template(tpl.get('ListCustomerView')));
              
    	var list = "<div class='span5'><div class='hero-unit'><table class='table'><tr><td>" +
    		        "<a id='btnAddCustomer' role='button' class='btn' data-toggle='modal'>+</a></td><td><select id='selectCustomer' size='10' >";
        if(customers!=null)
        {
        	customers.each(function(Customer){
        		list += "<option value='" + Customer.get('id') + "' >" + Customer.get('name').toUpperCase() 
        															   + " " + Customer.get('firstname')
        															   + " - " + Customer.get('address')  + "</option>";
        	});
        }
        list += "</select></td></tr></table></div></div><div  class='span5'><div id='dataCustomer' class='hero-unit'>" + customers.length + " clients dans votre annuaire </div></div>";
        
        $(this.el).append(list);      
       
        return this;
    },
    
    addCustomer: function(){
		customer = new Customer({'id': eval(customers.length+1)});
		customers.add(customer);
		
		this.template = _.template(tpl.get('DataCustomerView'));
		$('#dataCustomer').before(this.template(customer.toJSON()));
    	
      	// vide les infos du modal
		$("#inputName").val( "" );
		$("#inputFirstname").val( "" );
		$("#inputPhone").val( "" );
		$("#inputAdress").val( "" );
		$("#inputCp").val( "" );	
		$("#inputCity").val( "" );	
		$("#inputEmail").val( "" );	
    	$('#myModal').modal('show');
    },
    
    closeModal: function(){
    	$('#myModal').modal('hide');
    },
    
    saveCustomer: function(){
		
		 this.saveDataCustomer();		 
		 this.closeModal();    	
    },
	
	saveDataCustomer: function(){
		console.log("clic enregister!");
		success = true;

		//enregistre tous les clients dans le cache
		//customers.each(function(Customer){
		console.log($('#inputName').val());
		window.name = $('#inputName').val();
		window.firstname = $('#inputFirstname').val();
		window.address = $('#inputAddress').val();
		window.cp = $('#inputCp').val();
		window.city = $('#inputCity').val();
		window.phone = $('#inputPhone').val();
		window.mail = $('#inputEmail').val();

		customer.save({
			'name':name, 'firstname':firstname, 'address':address,
			'cp':cp, 'city':city, 'phone':phone, 'mail':mail
		},
		{

			silent: true
		});

		
		//update le fichier sur le serveur
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-customers.json"));
		console.log("dans collection customers"+customers);
		updateFile(obj.idFichier, JSON.stringify(customers.toJSON()), function(reponse) {	
			console.log(reponse);
				});
	},
	
	showCustomer : function (){
		var idCustomer = document.getElementById('selectCustomer').value ;
		var customer = JSON.parse( localStorage['customers-backbone-'+idCustomer] ) ;
			
		// charge les infos dans le div
		var infos = "<address><strong>"
					+ customer.name.toUpperCase() + " "
					+ customer.firstname + "</strong><br/>"
					+ customer.address + "<br/>"
					+ customer.cp + " " + customer.city + "<br/>"
					+ customer.phone + "<br/>"					
					+ "<a href='mailto:#'>" + customer.mail + "</a><br/></adresse>" ;		
		document.getElementById("dataCustomer").innerHTML =  infos ;

		console.log(customers);
    	
		this.template = _.template(tpl.get('DataCustomerView'));
		$('#dataCustomer').before(this.template());
		// charge les infos dans le modal et l'ouvre
		$("#inputName").val( customer.name );
		$("#inputFirstname").val( customer.firstname );
		$("#inputPhone").val( customer.phone );
		$("#inputAdress").val( customer.address );
		$("#inputCp").val( customer.cp );	
		$("#inputCity").val( customer.city );	
		$("#inputEmail").val( customer.mail );			
		$('#myModal').modal('show');
	}

});


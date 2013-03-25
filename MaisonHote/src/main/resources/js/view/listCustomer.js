window.ListCustomerView = Backbone.View.extend({
	
	idCustomer:null,
	
	events: {
		//"click #btnSearchCustomer"   : "searchCustomer"
		"click #btnAddCustomer": "addCustomer",
		"click #btnClose" : "closeModal",
		"click #btnSave" : "saveCustomer",
		"click #btnEditCustomer" : "showModalCustomer",
		"click #selectCustomer" : "showCustomer",
		"click #btnDeleteCustomer" : "deleteCustomer"
	},

    initialize: function () {
    	idCustomer = null;
    	customers = new Customers();
		customers.localStorage = new Backbone.LocalStorage("customers-backbone");
		customers.fetch();
		this.render();
    },

    render: function () {       
        var customersData = "<div class='span5'><div class='hero-unit'><table class='table'><tr><td>";
        customersData += this.createList();
        customersData += "</td><td><a id='btnAddCustomer' role='button' class='btn' data-toggle='modal'><img src='css/img/add_logo.png' width='30'  border='0'/></a><br/>"
        	     + "<a id='btnEditCustomer' role='button' class='btn' data-toggle='modal'><img src='css/img/edit_logo.png' width='30'  border='0'/></a><br/>"
        	     + "<a id='btnDeleteCustomer' role='button' class='btn'><img src='css/img/delete_logo.png' width='30'  border='0'/></a></td>"
        	     + "</tr></table></div></div><div  class='span5'><div id='dataCustomer' class='hero-unit'></div>";
                
        $(this.el).append(customersData);         
        return this;
    },
    
    reRender: function(){
    	$('#selectCustomer').replaceWith( this.createList() );    	
    },
    
    createList: function(){
    	var list = "<select id='selectCustomer' size='10' >";
        if(customers!=null)
        {
        	customers.each(function(Customer){
        		list += "<option value='" + Customer.get('id') + "' >" + Customer.get('name').toUpperCase() 
        															   + " " + Customer.get('firstname')
        															   + " (" + Customer.get('city')  + ")</option>";
        	});
        }
        list += "</select>";
        return list ;
    },   
    
    addCustomer: function(){		
		this.template = _.template(tpl.get('DataCustomerView'));
		$('#dataCustomer').before(this.template);
    	
      	// vide les infos du modal
		$("#inputName").val( "" );
		$("#inputFirstname").val( "" );
		$("#inputPhone").val( "" );
		$("#inputAddress").val( "" );
		$("#inputCp").val( "" );	
		$("#inputCity").val( "" );	
		$("#inputEmail").val( "" );	
    	$('#myModal').modal('show');    	
    },
    
    closeModal: function(){
    	this.reRender();
    	idCustomer = null ;
    	$('#myModal').modal('hide');
    },
    
    saveCustomer: function(){		
		 this.saveDataCustomer();		 
		 this.closeModal();    	
    },
	
    getNewId : function(){
    	var id = 0;
    	if(customers!=null){
	    	customers.each(function(Customer){
	    		if (Customer.get('id') > id)
	    			id = Customer.get('id') ;
	    	});
	    	
    	}
    	id += 1;
    	return id ;
    },
    
	saveDataCustomer: function(){		
		// If it'a new customer we have to create it
		var msg2show ;
		if ( !idCustomer ) {
			var newId = this.getNewId();			
			customer = new Customer({'id': newId});
			customers.add(customer);
			msg2show = 'Nouveau client ajouté avec succès.';
		}
		// else, we search the customer in the collection
		else {					
			customer = customers.get( idCustomer) ;
			msg2show = 'Client modifié avec succès.'
		}
		
		success = true;	
		
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
		},	{
				silent: true
		});
		
		//update file on server
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-customers.json"));
		updateFile(obj.idFichier, JSON.stringify(customers.toJSON()), function(){} );
		document.getElementById('dataCustomer').innerHTML = msg2show ;
		this.reRender();
	},
	
	showCustomer : function (){		
		var idCustomers = document.getElementById('selectCustomer').value ;
		var customer = JSON.parse( localStorage['customers-backbone-'+idCustomers] ) ;
			
		// we load data in the div		
		var infos = "<address><strong>"
					+ customer.name.toUpperCase() + " "
					+ customer.firstname + "</strong><br/>"
					+ customer.address + "<br/>"
					+ customer.cp + " " + customer.city + "<br/><br/>"
					+ customer.phone + "<br/>"					
					+ "<a href='mailto:#'>" + customer.mail + "</a><br/></adresse>" ;		
		document.getElementById("dataCustomer").innerHTML =  infos ;		
	},
	
	showModalCustomer : function (){
		if ( document.getElementById('selectCustomer').selectedIndex != -1 ){
			idCustomer = document.getElementById('selectCustomer').value ;		
			var customer = JSON.parse( localStorage['customers-backbone-'+idCustomer] ) ;
			
			this.template = _.template(tpl.get('DataCustomerView'));
			$('#dataCustomer').before(this.template());
			
			// we load data in the modal and open it
			$("#inputName").val( customer.name );
			$("#inputFirstname").val( customer.firstname );
			$("#inputPhone").val( customer.phone );
			$("#inputAddress").val( customer.address );
			$("#inputCp").val( customer.cp );	
			$("#inputCity").val( customer.city );	
			$("#inputEmail").val( customer.mail );			
			$('#myModal').modal('show');
		}
	},
	
	deleteCustomer : function (){
		if ( document.getElementById('selectCustomer').selectedIndex != -1 ){
			customer = customers.get( document.getElementById('selectCustomer').value) ;		
			localStorage.removeItem('customers-backbone-'+customer.get('id')) ;
			customers.remove(customer);		
			var obj = JSON.parse(localStorage.getItem("fichier-backbone-customers.json"));
			updateFile(obj.idFichier, JSON.stringify(customers.toJSON()), function (){} );
			document.getElementById('dataCustomer').innerHTML = "Client supprimé avec succès." ;
			this.reRender();
		}
	}
	
});


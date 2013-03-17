window.ListCustomerView = Backbone.View.extend({

	events: {
		//"click #btnSearchCustomer"   : "searchCustomer"
		"click #btnAddCustomer": "constructFormCustomer",
		"click #btnClose" : "closeModal",
		"click #btnSave" : "saveCustomer",
		"click #selectCustomer" : "showCustomer",
		"click #inputAutocompletion" : "Autocompletion"
	},

    initialize: function () {
        this.render();
    },

    render: function () {
       // $(this.el).html(_.template(tpl.get('ListCustomerView')));
              
    	var list = "<div class='span5'><a id='btnAddCustomer' role='button' class='btn' data-toggle='modal'>+</a><select id='selectCustomer' size='10'>";
        if(customers!=null)
        {
        	customers.each(function(Customer){
        		list += "<option value='" + Customer.get('id') + "'>" + Customer.get('name').toUpperCase() + " " + Customer.get('firstname') + "</option>";
        	});
        }
        list += "</select></div><div id='dataCustomer' class='span5'></div>";
        
        $(this.el).append(list);
        
        /* champ pour tester l'autocompetion */
        var testAuto = '<input id="inputAutocompletion" type="text">' ;                
        $(this.el).append(testAuto);
       
        return this;
    },
    
    Autocompletion : function (){
    	/*var testValue = {}, i;      
    	if(customers!=null)
        {
        	customers.each(function(Customer){
        		i = Customer.get('id');
        		testValue[i] = Customer.get('name') + " " + Customer.get('firstname') ;
        	});
        }	  	        
    	console.log(testValue);*/ 
    	
    	var namesArray = new Array();
    	if(customers!=null)
        {
        	customers.each(function(Customer){        		
        		namesArray.push( Customer.get('name') + " " + Customer.get('firstname')  );
        	});
        }
        	
    	$('#inputAutocompletion').typeahead({ source: namesArray}) ;
    },
    
    constructFormCustomer: function(){
    	console.log("clic add !");
    	console.log("nbCustomers avant ++ : "+window.nbCustomers);
    	window.nbCustomers++;
    	console.log("nbCustomers après ++ : "+window.nbCustomers);

		customer = new Customer({'id': window.nbCustomers});
		customers.add(customer);

//		var obj = JSON.parse(localStorage.getItem("fichier-backbone-customers.json"));
//		if(obj==null)
//		this.createFileClient();

		this.template = _.template(tpl.get('DataCustomerView'));
		$('#dataCustomer').before(this.template(customer.toJSON()));
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
		window.phone = $('#inputPhone').val();
		window.mail = $('#inputEmail').val();

		customer.save({
			'name':name, 'firstname':firstname, 'address':address,
			'phone':phone, 'mail':mail
		},
		{
//			success: function(model, response, options) {
//			nbCustomersSauveesDansCache++;
//			},
			//pour que la fonction reRenderChambre ne soit pas appelée
			// à cause de la modif (les clients sont bindées)
			silent: true
		});
		//	});

//		if(!success) {
//		return;
//		}

		$('#waitingResult').css('visibility','visible');
		$('#waitingResult').show();
		
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
		var infos = customer.name.toUpperCase() + "<br/>"
					+ customer.firstname + "<br/>"
					+ customer.phone + "<br/>"
					+ customer.address + "<br/>"
					+ customer.mail + "<br/>" ;		
		document.getElementById("dataCustomer").innerHTML =  infos ;
		
		// charge les infos dans le modal et l'ouvre
		$("#inputName").val( customer.name );
		$("#inputFirstname").val( customer.firstname );
		$("#inputPhone").val( customer.phone );
		$("#inputAdress").val( customer.address );
		$("#inputEmail").val( customer.mail );			
		$('#myModal').modal('show');
	}

//	searchCustomer: function (){
//	var size = document.getElementById('selectCustomer').options.length;
//	for(i=0;i<size;i++){	
////	console.log(document.getElementById('i').text);
////	console.log(document.getElementById('inputSearch').value);
//	if(document.getElementById("'"+i+"'").text == document.getElementById('inputSearch').value){
//	console.log("dans boucle");
//	document.getElementById('i').active();
//	}
//	}

//	}

});


window.ListCustomerView = Backbone.View.extend({
	
	events: {
		//"click #btnSearchCustomer"   : "searchCustomer"
		"click #btnAddCustomer": "constructFormCustomer",
		"click #btnClose" : "closeModal",
		"click #btnSave" : "saveCustomer"
	},

    initialize: function () {
        this.render();
    },

    render: function () {
        window.nbCustomers = 0;
        window.customers = new Customers();
		window.customers.localStorage = new Backbone.LocalStorage("customers-backbone");

        $(this.el).html(_.template(tpl.get('ListCustomerView')));
        return this;
    },
    
    constructFormCustomer: function(){
    	console.log("clic add !");
		nbCustomers++;

		var customer = new Customer({'id': window.nbCustomers});
		customers.add(customer);
		
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-customers.json"));
		if(obj==null)
			this.createFileClient();
		
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
		window.nbCustomersSauveesDansCache = 0;

		//enregistre toutes les clients dans le cache
		customers.each(function(Customer){
			console.log($('#inputName').val());
			window.name = $('#inputName').val();
			window.firstname = $('#inputFirstname').val();
			window.address = $('#inputAddress').val();
			window.phone = $('#inputPhone').val();
			window.mail = $('#inputMail').val();

			Customer.save({
				'name':name, 'firstname':firstname, 'address':address,
				'phone':phone, 'mail':mail
			},
			{
				success: function(model, response, options) {
					nbCustomersSauveesDansCache++;
				},
				//pour que la fonction reRenderChambre ne soit pas appelée
				// à cause de la modif (les clients sont bindées)
				silent: true
			});
		});
		
		if(!success) {
			return;
		}
		
		$('#waitingResult').css('visibility','visible');
		$('#waitingResult').show();

		//update le fichier sur le serveur
		var obj = JSON.parse(localStorage.getItem("fichier-backbone-customers.json"));
		updateFile(obj.idFichier, JSON.stringify(customers.toJSON()), function(reponse) {	
			$('#waitingResult').fadeOut('fast');
			//Vérifie que tout s'est bien passé et affiche un message en conséquence
			if (!reponse.error && nbCustomersSauveesDansCache === nbCustomers) {
				$('#goodResult').css('visibility','visible');
				$('#goodResult').show();
				$('#goodResult').fadeOut(3000, function() {
					$('#goodResult').css('visibility','hidden');
				});
			} else {
				console.log("ERROR § " + nbCustomersSauveesDansCache +
							" clients sur " + nbCustomers +
							" ont été sauvegardées dans le cache");
				$('#badResult').css('visibility','visible');
				$('#badResult').show();
				$('#badResult').fadeOut(15000, function() {
					$('#badResult').css('visibility','hidden');
				});
			}
		});
	},
	
	createFileClient: function(){
		createNewFile('customers.json', function(reponse){
			window.idCustomer = reponse.id;

			console.log("dans createNewFile");
			//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
			var fileCustomer = new FichierConfig({'id':reponse.title, 'idFichier': idCustomer });
			fileCustomer.save();

			updateFile(reponse.id,  JSON.stringify(customers.toJSON()),function(reponse){	
				console.log(reponse);
			});

		});
	}
    
    
//    searchCustomer: function (){
//    	var size = document.getElementById('selectCustomer').options.length;
//    	for(i=0;i<size;i++){	
////    		console.log(document.getElementById('i').text);
////			console.log(document.getElementById('inputSearch').value);
//    		if(document.getElementById("'"+i+"'").text == document.getElementById('inputSearch').value){
//    			console.log("dans boucle");
//    			document.getElementById('i').active();
//    		}
//    	  }
//    	
//    }
    
});


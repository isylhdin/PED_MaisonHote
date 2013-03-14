//Connection to the appropriate host
function connectToHost(callback){
	var funToCall = "connectToHost"+currentHost+'('+callback+')';
	eval(funToCall);
}

function handleAuthResult (authResult) {
	var funToCall = "handleAuthResult"+currentHost+'(\''+authResult+'\')';
	eval(funToCall);
}

//Call the correct function which creates a new file, according to the current file host
function createNewFile(fileName,callback){
	var funToCall = "createNewFile"+currentHost+'("'+fileName+'",'+callback+')';
	eval(funToCall);
}

//Retrieve a file in the host folder
function retrieveFile(fileName, callback){
	var funToCall = "retrieveFile"+currentHost+'("'+fileName+'",'+callback+')';
	eval(funToCall);
}

//Create a new file in the host folder
function createNewFile(fileName,callback){
	var funToCall = "createNewFile"+currentHost+'("'+fileName+'",'+callback+')';
	eval(funToCall);
}

//Get the content of a file
function getFileContent (file, callback) {
	var funToCall = "getFileContent"+currentHost+'(\''+file+'\','+callback+')';
	eval(funToCall);
}

//Update an existing file
function updateFile (file, newContent, callback) {
	var funToCall = "updateFile"+currentHost+'(\''+file+'\',\''+newContent+'\','+callback+')';
	//alert(funToCall);
	eval(funToCall);
}


function setToken () {
	var funToCall = "setToken"+currentHost+'()';
	eval(funToCall);
}




/**
 * COMMON FUNCTIONS TO EVERY FILE HOSTER
 **/

function saveChambreIntoLocalStorage(fileContent){
	var chambres = jQuery.parseJSON(fileContent);

	for(var i=0; i<chambres.length;i++){
		var chambre = new Chambre(chambres[i]);
		chambre.save();	

		//nécessaire pour afficher la légende du calendrier
		chambresPourCalendrier.add(chambre);
	}
}


function saveresaIntoLocalStorage(fileContent){
	if(fileContent != ""){
		var reser = jQuery.parseJSON(fileContent);

		for(var i=0; i<reser.length;i++){
			window.indice = i;
			var resa = new Reservation(reser[i]);
			resa.save();

			//remplit la collections de calendar.js avec les reservations téléchargées pour qu'elles soient directement affichées dans
			//le calendrier
			reservations.add(resa);
		}
	}
}


function savehouse_config_prestationsIntoLocalStorage(fileContent){
	if(fileContent != ""){
		var prestations = jQuery.parseJSON(fileContent);

		for(var i=0; i<prestations.length;i++){
			var prestation = new Prestation(prestations[i]);
			prestation.save();	
		}
	}
}

function savecustomersIntoLocalStorage(fileContent){
	if(fileContent != ""){
		var customers = jQuery.parseJSON(fileContent);
		window.nbCustomers = 0;

		for(var i=0; i<customers.length;i++){
			window.nbCustomers++;
			var customer = new Customer(customers[i]);
			customer.save();	
		}
	}
}


/**
 * Cette méthode vérifie que le fichier house_config.json est présent sur le serveur. A parti de là on
 * peut déterminer si c'est une première utilisation de l'application. Ce fichier est primordial pour
 * l'application, elle ne peut pas fonctionner sans ce dernier.
 * Si c'est la première utilisation l'utilisateur est dirigé sur la page de configuration des chambres, 
 * sinon on récupère tous les autres fichiers et on stocke leur contenu dans le cache.
 */
function downloadRequiredFiles(){

	window.requiredFiles = ['house_config_prestations.json','resa.json', 'customers.json'];


	retrieveFile('house_config_chambres.json', function(reponse){
		if (reponse.items.length == 0 ) {
			alert("PREMIERE UTILISATION");
			app.firstConfigChambre();
		}
		else{

			retrieveAndStoreOtherFiles(requiredFiles);

			tpl.downloadFile(reponse.items[0] , saveChambreIntoLocalStorage);

			var houseConfig = new FichierConfig({'id': 'house_config_chambres.json', 'idFichier': reponse.items[0].id});
			houseConfig.save();

			$('#room').show();
			$('#logOut').show();
			document.getElementById('nameAppli').href = "#resa";
			$('#service').show();
			$('#listCustomer').show();

			//et on redirige sur la page des réservations
			app.resa();
		}
	});
}


/**
 * Recupère tous les autres fichiers (non vitaux pour le bon fonctionnement de l'appli) et stocke 
 * le contenu dans le cache
 * @param requiredFiles
 */
function retrieveAndStoreOtherFiles(requiredFiles){
	for (var i= 0; i < requiredFiles.length; i++) {  

		window.fichier = requiredFiles[i];

		retrieveFile(fichier, function(reponse){
			//s'il n'existe pas sur le serveur
			if (reponse.items.length == 0 ) {

				// on le crée sur le serveur
				createNewFile(fichier, function(reponse){	
					window.idFichier = reponse.id;
					console.log("un fichier a été créé sur le serveur, il a l'id "+idFichier);
				});

			}
			else{
				console.log("le fichier "+reponse.items[0].title+" était deja sur le serveur, il a l'id "+reponse.items[0].id);

				//pour appeler la bonne méthode qui va sauvagegarder dans le cache, on retire .json au nom du fichier
				var reg=new RegExp("[.]+", "g"); 
				var tableau=reponse.items[0].title.split(reg);
				var name = tableau[0]; //contient "resa" par exemple

				tpl.downloadFile(reponse.items[0] , eval("save"+name+"IntoLocalStorage"));

				//stocke l'id du fichier récupéré du serveur, dans le cache
				var fichierConfig = new FichierConfig({'id': reponse.items[0].title,'idFichier': reponse.items[0].id});
				fichierConfig.save();

			}
		});        
	}
}

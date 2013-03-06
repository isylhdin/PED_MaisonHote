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
	}
}

function saveresaIntoLocalStorage(fileContent){
	window.reser = jQuery.parseJSON(fileContent);
	
	for(var i=0; i<reser.length;i++){
		window.indice = i;
		var resa = new Reservation(reser[i]);
		resa.save();

		reservations.add(resa);

	}
}


/**
 * Cette méthode sert à récupérer les métadonnées du fichier house_config.json qui est le seul fichier véritablement
 *  requis pour utiliser l'application. Ca détermine ensuite si on doit configurer les chambres pour la première fois où
 *  si on est redirigé sur la page des réservations
 * @param file = le fichier à récupérer, en l'occurence le fichier house_config.json
 */
function getEntryPointFile(file){

	window.file = file;
	
	retrieveFile(window.file, function(reponse){
		if (reponse.items.length == 0 ) {
			alert("PREMIERE UTILISATION");
			app.firstConfigChambre();
		}
		else{
			tpl.downloadFile(reponse.items[0] , saveChambreIntoLocalStorage);

			var houseConfig = new FichierConfig({'id': window.file, 'idFichier': reponse.items[0].id});
			houseConfig.save();

			$('#room').show();
			$('#logOut').show();
			$('#nameAppli').show();
			//et on redirige sur la page des réservations
			app.resa();
		}
	});
}


/**
 * Télécharge les métadonnées de tous les fichiers utilisés par l'application
 */
function downloadRequiredFiles(){

	window.requiredFiles = ['house_config.json','resa.json'];

	getEntryPointFile(requiredFiles[0]);


	for (var i= 1; i < requiredFiles.length; i++) {  

		window.fichier = requiredFiles[i];

		retrieveFile(fichier, function(reponse){
			//s'il n'existe pas sur le serveur
			if (reponse.items.length == 0 ) {
				
				// on le crée sur le serveur
				createNewFile(fichier, function(reponse){	
					window.idFichier = reponse.id;
					console.log("le fichier "+fichier+" a été créé sur le serveur, il a l'id "+idFichier);
				});
				
			}
			else{
				console.log("le fichier "+fichier+" était deja sur le serveur, il a l'id "+reponse.items[0].id);
				
				//pour appeler la bonne méthode qui va sauvagegarder dans le cache, on retire .json au nom du fichier
				var reg=new RegExp("[.]+", "g"); 
				var tableau=fichier.split(reg);
				var name = tableau[0]; //contient "resa" par exemple

				tpl.downloadFile(reponse.items[0] , eval("save"+name+"IntoLocalStorage"));

				//stocke l'id du fichier récupéré du serveur, dans le cache
				var fichierConfig = new FichierConfig({'id': reponse.items[0].title,'idFichier': reponse.items[0].id});
				fichierConfig.save();

			}
		});        
	}
}




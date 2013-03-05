//old key, in case : 966416489314.apps.googleusercontent.com		
//key to use : 133252798458.apps.googleusercontent.com
var config = {
		'client_id': '133252798458.apps.googleusercontent.com',
		'scope': 'https://www.googleapis.com/auth/drive'
};


/**
 *  Connection 
 **/
function connectToHostDrive(callback){
	gapi.auth.authorize(config, callback);
}

function handleAuthResultDrive (authResult) {
	//si connexion réussie + token récupéré
	if (authResult && !authResult.error) {
		window.localStorage.clear();

		//on téléchatge les métadonnées de tous les fichiers qui seront utilisés par l'appli, à la connexion
		downloadRequiredFiles();
		/*retrieveFileDrive('house_config.json', function(reponse){

			if (reponse.items.length == 0) {
				alert("PREMIERE UTILISATION");
				app.firstConfigChambre();
			}else{
				alert("FICHIER de configuration présent sur google drive !");
				tpl.downloadFile(reponse.items[0] , saveContentFileIntoLocalStorage);

				var houseConfig = new FichierConfig({'idFichier': reponse.items[0].id});
				houseConfig.save();

				//on charge le menu
				// this.headerView = new HeaderView();
				// $('.header').html(this.headerView.el);
				$('#room').show();
				$('#logOut').show();
				$('#nameAppli').show();
				//et on redirige sur la page des réservations
				app.resa();
			}
		});*/


	} 
	else{
		console.log("Récupération de token : FAIL");
	}	
}

/** 
 * Retrieve a file
 **/
function retrieveFileDrive(fileName, callback) {

	var request = gapi.client.request({
		'path': '/drive/v2/files',
		'method': 'GET',
		'params': {
			q : "title='"+fileName+"'"
		}	        
	});	

	request.execute(function(resp) {
		callback(resp);
	});
}


/** 
 * Create a new file on the Drive 
 **/
function createNewFileDrive(fileName, callback) {
	gapi.client.load('drive', 'v2');

	var request = gapi.client.request({
		'path': '/drive/v2/files',
		'method': 'POST',
		'body':{
			"title" : fileName,
			"mimeType" : "application/json",
			"description" : "Config file of the guest house"	     	          
		}
	});

	request.execute(function(resp) { 
		console.log("File created : id = "+ resp.id);
		//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
		var houseConfig = new FichierConfig({'id':resp.title, 'idFichier': resp.id });
		houseConfig.save();
		callback(resp);
	});	     	   
}


/**
 * Get file content
 **/
function getFileContentDrive (file, callback) {
	if (file.downloadUrl) {
		var accessToken = gapi.auth.getToken().access_token;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file.downloadUrl);
		xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
		xhr.onload = function() {
			callback(xhr.responseText);
		};
		xhr.onerror = function() {
			callback(null);
		};
		xhr.send(); 
	} else {
		callback(null);
	}
}


/**
 * Update an existing file knowing his 'fileId'
 **/
function updateFileDrive (fileId, newContent, callback) {	    	   	    	
	//gapi.client.load('drive', 'v2');

	var request = gapi.client.request({
		'path': '/upload/drive/v2/files/'+ fileId, 
		'method': 'PUT',
		'params': {'uploadType': 'media'},	    	        
		'body': newContent});

	request.execute(function(resp){
		callback(resp);
	});	    	   
}
var config = {
		'client_id': '133252798458.apps.googleusercontent.com',
		'scope': 'https://www.googleapis.com/auth/drive'
};

var MghDirectoryID = null;

/**
 *  Connection 
 **/
function connectToHostDrive(){
	gapi.auth.authorize(config, handleAuthResultDrive );
}

function handleAuthResultDrive (authResult) {
	console.log(gapi.auth.getToken());
	//si connexion réussie + token récupéré
	if (authResult && !authResult.error) {

		//console.log(authResult);
		var token = new Token(authResult);
		token.save();
		
		// we have to check if the directory MyGuestHouse exists
		retrieveFileDrive( "MyGuestHouse", function (resp){
				if (resp.items.length == 0)
					createNewDirectoryDrive("MyGuestHouse", function(resp) {
						MghDirectoryID = resp.id ;
					} );
				else
					MghDirectoryID = resp.items[0].id ;
		});
		
		
		//on télécharge les métadonnées de tous les fichiers qui seront utilisés par l'appli, à la connexion
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
 * Get the id of the Mgh directory
 **/
function setMghDirectoryIdDrive () {
	retrieveFileDrive( "MyGuestHouse", function (response){
		MghDirectoryID = response.items[0].id ;
	});
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
			"description" : "Config file of the guest house",
			"parents": [{ "id": MghDirectoryID  }]
		}
	});

	request.execute(function(resp) {		
		//on conserve l'id du fichier dans le cache pour pouvoir utiliser le web service d'update dessus (a besoin de son id)
		var houseConfig = new FichierConfig({'id':resp.title, 'idFichier': resp.id });
		houseConfig.save();
		callback(resp);
	});	     	   
}

/**
 * Create directory
 */
function createNewDirectoryDrive(fileName, callback) {
	var request = gapi.client.request({
		'path': '/drive/v2/files',
		'method': 'POST',
		'body':{
			  "title": fileName,
			  "parents": "roots",
			  "mimeType": "application/vnd.google-apps.folder"
		}
	});
	
	request.execute(function(resp) { 			
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
	var request = gapi.client.request({
		'path': '/upload/drive/v2/files/'+ fileId, 
		'method': 'PUT',
		'params': {'uploadType': 'media'},	    	        
		'body': newContent});

	request.execute(function(resp){
		callback(resp);
	});	    	   
}


function setTokenDrive () {
	var idToken = localStorage.getItem('token-backbone');
	var token = jQuery.parseJSON(localStorage.getItem('token-backbone-'+idToken));	
	gapi.auth.setToken(new Token(token));	
}
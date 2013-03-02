
window.drive = {

//		Get template by name from map of preloaded templates
		get: function(name) {
			return this.templates[name];
		},

		/** Retrieve and print a file's metadata. **/
		retrieveFile: function (fileName, callback) {

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
		},


		/** Create a new file on the Drive **/
		createNewFile: function(fileName, callback) {
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
				var houseConfig = new FichierConfig({'idFichier': resp.id});
				houseConfig.save();
				callback(resp);
			});	     	   
		},


		/** Update an existing file knowing his 'fileId' **/
		updateFile: function(fileId, newContent, callback) {	    	   	    	
			//gapi.client.load('drive', 'v2');

			var request = gapi.client.request({
				'path': '/upload/drive/v2/files/'+ fileId, 
				'method': 'PUT',
				'params': {'uploadType': 'media'},	    	        
				'body': newContent});

			request.execute(function(resp){
				callback(resp);
			});	    	   
		},

		downloadFile : function (file, callback) {
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
		},

		saveContentFileIntoLocalStorage : function (fileContent){
			var chambres = jQuery.parseJSON(fileContent);

			for(var i=0; i<chambres.length;i++){
				var chambre = new Chambre(chambres[i]);
				chambre.save();				
			}
		}

}
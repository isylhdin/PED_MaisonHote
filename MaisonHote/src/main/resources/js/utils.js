window.utils = {
		
		
		test: function(){
			console/log("TEST");
		},
		
		/** Print a file's metadata. **/
		printFile: function (fileId) {
			var request = gapi.client.drive.files.get({
				'fileId': fileId
			});
			request.execute(function(resp) {
				console.log('Title: ' + resp.title);
				console.log('Description: ' + resp.description);
				console.log('MIME type: ' + resp.mimeType);
			});
		},

		
		/** Download a file's content **/
		downloadFile :function (file, callback) {
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

}
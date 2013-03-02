// client is a Dropbox.Client instance that you can use to make API calls.
var client = new Dropbox.Client({
	   key: "q3YGlikSvTA=|5VlJUtTaR55fmB0pERJVnZ9kSFoN192U8Uxad7+92w==", sandbox: true
});
// provides the integration between the application and the Dropbox OAuth flow
client.authDriver(new Dropbox.Drivers.Redirect({useQuery : true , rememberUser: true}));

// errors handling
var showError = function(error) {
	   switch (error.status) {
    	   case Dropbox.ApiError.INVALID_TOKEN:
    	     // If you're using dropbox.js, the only cause behind this error is that
	     // the user token expired.
	     // Get the user through the authentication flow again.
	     console.log("invalid token");
	     break;

	   case Dropbox.ApiError.NOT_FOUND:
	     // The file or folder you tried to access is not in the user's Dropbox.
	     // Handling this error is specific to your application.
	     console.log("file or folder does not exist");
	     break;

	   case Dropbox.ApiError.OVER_QUOTA:
	     // The user is over their Dropbox quota.
	     // Tell them their Dropbox is full. Refreshing the page won't help.
	     console.log("Quota over");
	     break;

	   case Dropbox.ApiError.RATE_LIMITED:
	     // Too many API requests. Tell the user to try again later.
	     // Long-term, optimize your code to use fewer API calls.
	     console.log("too many api request. try later");
	     break;

	   case Dropbox.ApiError.NETWORK_ERROR:
	     // An error occurred at the XMLHttpRequest layer.
	     // Most likely, the user's network connection is down.
	     // API calls will not succeed until the user gets back online.
	     console.log("please connect to a network");
	     break;

	   case Dropbox.ApiError.INVALID_PARAM:
	   case Dropbox.ApiError.OAUTH_ERROR:
	   case Dropbox.ApiError.INVALID_METHOD:
	   default:
	     // Caused by a bug in dropbox.js, in your application, or in Dropbox.
	     // Tell the user an error occurred, ask them to refresh the page.
		   console.log("error with not known cause");
	   }
};

   // show OAuth token credentials : key, token, token secret, uid
   function showClient(){
		console.log(client.credentials());
   }

   // Authenticates the app's user to Dropbox' API server.	       
   function connectDropbox(callback){
   	 if ( !client.isAuthenticated() ){					
			console.log("Connection to Dropbox");
			
		   client.authenticate(function(error, client) {
			  if (error) {
			    console.log("Connection to Dropbox error :\n-->");
			    return showError(error);
			  }

			  console.log("Connection to dropbox ok, you are authorized to make API calls.");
			  if (callback != null)
				  callback();
		   });
	}
	 else
		console.log("Already authentified to dropbox");
  }

// Create a file in the user's dropbox app folder
function createFileDropbox(fileName,content){
	if ( !client.isAuthenticated() ){
		console.log("You have to be authentified to use DropBox API.");
		connectDropbox();
	}
	else {						  						 
	  client.writeFile(fileName, content, function(error, stat) {
				  if (error) {
					console.log("Writing file error :\n-->");  
				    return showError(error);
				  }

				  console.log("File saved as revision " + stat.versionTag);
				  });					 
		}
}
   
function test(){
	alert("test");
	
}


// Returns true is the file has been found on the APP directory, false otherwise
function findFileDropbox(fileName, callback){
	
	if ( !client.isAuthenticated() ){
		console.log("You have to be authentified to use DropBox API.");
		connectDropbox();					
	}
	else {								
		client.findByName("",fileName, function(error, statArray) {
			if (error) {
				console.log("Searching file '"+ fileName +"' error :n-->");  
			    return showError(error);  // Something went wrong.
			  }
			  // if file has been found
			  if ( statArray.length > 0 ) {
				  console.log("File '"+ fileName + "' found.");				 
				  callback(true);
			  }
			  else {
				  console.log("File '"+ fileName + "' not found.");
				  callback(false);
			  }
		});				
	}			
}

// List every files contained in the APP directory		
function listFilesDropbox(){
	if ( !client.isAuthenticated() ){
		console.log("You have to be authentified to use DropBox API.");
		connectDropbox();					
	}
	else {
		 client.readdir("", function(error, entries) {
			  if (error) {
				 console.log("Listing files error :\n-->") ;  
			     return showError(error);  // Something went wrong.
			  }

			  console.log("Your Dropbox contains " + entries.join(", "));
		});
	 }				 
}

// Print data in console
function printContentDropbox(data){
	console.log("File content : " + data);
}

// Get 'fileName' content and send it in callback function
function getFileContentDropbox(fileName,callback){
	
	if ( !client.isAuthenticated() ){		
		console.log("You have to be authentified to use DropBox API.");
		connectDropbox();			
	}
	else {
   		client.readFile(fileName, function(error, data) {
   		  if (error) {
   			console.log("getFile error :\n-->") ;  
   		    return showError(error);  // Something went wrong.
   		  }
   		  
   		  callback(data);  // data has the file's contents
   		});
 	 }
}

function saveContentFileIntoLocalStorageDropbox (fileContent){
	alert("==>"+fileContent);
	var chambres = jQuery.parseJSON(fileContent);
	
	for(var i=0; i<chambres.length;i++){
		var chambre = new Chambre(chambres[i]);
		chambre.save();				
	}
}

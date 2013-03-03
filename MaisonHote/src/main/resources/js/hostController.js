// currentHost contains the name of the file host currently in use
var currentHost ;

// Connection to the appropriate host
function connectToHost(callback){
	var funToCall = "connectToHost"+currentHost+'('+callback+')';
	eval(funToCall);
}

function handleAuthResult (authResult) {
	var funToCall = "handleAuthResult"+currentHost+'(\''+authResult+'\')';
	eval(funToCall);
}

// Call the correct function which creates a new file, according to the current file host
function createNewFile(fileName,callback){
	var funToCall = "createNewFile"+currentHost+'("'+fileName+'",'+callback+')';
	eval(funToCall);
}

// Retrieve a file in the host folder
function retrieveFile(fileName, callback){
	var funToCall = "retrieveFile"+currentHost+'("'+fileName+'",'+callback+')';
	eval(funToCall);
}

// Create a new file in the host folder
function createNewFile(fileName,callback){
	var funToCall = "createNewFile"+currentHost+'("'+fileName+'",'+callback+')';
	eval(funToCall);
}

// Get the content of a file
function getFileContent (file, callback) {
	var funToCall = "getFileContent"+currentHost+'(\''+file+'\','+callback+')';
	eval(funToCall);
}

// Update an existing file
function updateFile (file, newContent, callback) {
	var funToCall = "updateFile"+currentHost+'(\''+file+'\',\''+newContent+'\','+callback+')';
	alert(funToCall);
	eval(funToCall);
}

/**
 * COMMON FUNCTIONS TO EVERY FILE HOSTER
**/
function saveContentFileIntoLocalStorage(fileContent){
	var chambres = jQuery.parseJSON(fileContent);
	
	for(var i=0; i<chambres.length;i++){
		var chambre = new Chambre(chambres[i]);
		chambre.save();				
	}
}

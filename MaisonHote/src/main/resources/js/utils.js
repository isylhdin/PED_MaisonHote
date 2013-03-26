/**
 * Calcule le prix de séjour dans la chambre passée en paramètre.
 * 
 * @param room : la chambre pour laquelle on va calculer le prix à payer
 * @returns le prix à payer pour une chambre
 */

function computePriceOverDaysForRoom(room){
	
	var duration = getDuration(room);
	var idRoom = room.room;
	var room = jQuery.parseJSON(localStorage.getItem('chambres-backbone-'+idRoom));
	var pricePerDay = room.prixParJour;
	
	var computedPrice = eval(duration * pricePerDay);
	
	return computedPrice;
}

/**
 * Calcule le nombre de jour où la chambre est réservée
 * @param room
 * @returns
 */
function getDuration(room){
	var start = room.start;
	var end = room.end;
	
	var reg = new RegExp("[-T]+", "g"); 
	var tabStart = start.split(reg);
	var tabEnd = end.split(reg);
		
	start = tabStart[2];
	end = tabEnd[2];
	
	var duration = eval(end-start)+1;
	return duration;
	
}

/**
 * Retrouve l'id du client qu'on a sélectionné dans la pop-up de resa
 * @param client
 * @returns
 */
function findClient(client){
	
	var reg = new RegExp("[ ]+", "g"); 
	var tab = client.split(reg);
	var name = tab[0];
	var firstName = tab[1];
	console.log("nom : "+name +" prenom = "+ firstName);
	
	window.result = customersResa.filter(function(model){
		return model.attributes.name == name && model.attributes.firstname == firstName;
	});	//retourne une collection, alors qu'on n'a besoin que d'un seul résultat
	
	var foundClients = new Customers(result);
	foundClients.each(function(Client){
		result = Client.id;	
	});

	return result;
}



/**
 * retrouve toutes les sous réservations (les chambres louées par une même personne) 
 * pour une même réservation
 * @param reservations
 * @returns
 */

function getAllResaFromGroup(idResaGroup) { 

	var resaGroup = reservations.filter(function(model){
		return model.attributes.idResaGroup === idResaGroup;
	});	
	console.log(resaGroup);
	return resaGroup;
}

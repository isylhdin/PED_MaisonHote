/**
 * Calcule le prix de séjour dans la chambre passée en paramètre.
 * 
 * @param room : la chambre pour laquelle on va calculer le prix à payer
 * @returns le prix à payer pour une chambre
 */

function computePriceOverDaysForRoom(room) {
	var duration = getDuration(room),
		idRoom = room.room,
		room = jQuery.parseJSON(
			localStorage.getItem('chambres-backbone-' + idRoom)),
		pricePerDay = room.prixParJour,
		computedPrice = eval(duration * pricePerDay);

	return computedPrice;
}

/**
 * Calcule le nombre de jour où la chambre est réservée
 * @param room
 * @returns
 */
function getDuration(room) {
	var start = room.start,
		end = room.end,
		reg = new RegExp('[-T]+', 'g'),
		tabStart = start.split(reg),
		tabEnd = end.split(reg);

	start = tabStart[2];
	end = tabEnd[2];

	var duration = eval(end - start) + 1;
	return duration;
}

/**
 * Retrouve l'id du client qu'on a sélectionné dans la pop-up de resa
 * @param fullName
 * @returns
 */
function findClient(fullName) {
	var reg = new RegExp('[ ]+', 'g'),
		tab = fullName.split(reg),
		firstName = tab[0],
		lastName = tab[1],
		foundClients;

	// retourne une collection, alors qu'on n'a besoin que d'un seul résultat
	window.result = customersResa.filter(function(model) {
		return model.get('lastName') === lastName &&
			model.get('firstName') === firstName;
	});

	foundClients = new Customers(result);
	foundClients.each(function(client) {
		result = client.id;
	});

	return result;
}

/**
 * retrouve toutes les sous réservations (les chambres louées par une même
 * personne) pour une même réservation
 * @param reservations
 * @returns
 */

function getAllResaFromGroup(idResaGroup) { 
	var resas = reservations.filter(function(resa) {
		return resa.get('idResaGroup') === idResaGroup;
	});	
	return resas;
}

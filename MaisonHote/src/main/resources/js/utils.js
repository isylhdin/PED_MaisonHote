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
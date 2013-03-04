function addResaDialogWidgets() {
	$("input[name=nbPersons]").spinner({
		spin: function(event, ui) {
			if (ui.value > 10) {
				$(this).spinner("value", 1);
				return false;
			} else if (ui.value < 1) {
				$(this).spinner("value", 10);
					return false;
			}
		}
	}).val(1);
}
function initResaDialog() {
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

	$('#resa-form').validate({
		rules: {
			lastName: {
				required: true
			},
			firstName: {
				required: true
			},
			phone: {
				required: true
			},
			email: {
				email: true
			},
			room: {
				required: true
			}
		},
		highlight: function(element) {
			$(element).closest('.control-group').removeClass('success').addClass('error');
		},
		success: function(element) {
			element.text('OK!').addClass('valid')
				.closest('.control-group').removeClass('error').addClass('success');
		}
	});
}

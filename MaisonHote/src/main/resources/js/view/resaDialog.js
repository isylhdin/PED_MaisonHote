function initResaDialog() {
	$("input[name=nbPersons]").spinner({min: 1});

    jQuery.validator.addMethod("phone", function(value, element) {
        if (value.length == 0) {
        	return true;
        }
        return /^0\d \d\d \d\d \d\d \d\d$/i.test(value);
    }, 'Expected phone number format: <i>0X XX XX XX XX</i>');
 
	$('#resa-form').validate({
		rules: {
			lastName: {
				required: true
			},
			firstName: {
				required: true
			},
			phone: {
				phone: true
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

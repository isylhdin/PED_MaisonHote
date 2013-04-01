window.validateForm = {

		onError: function(model, error, a) {
			success = false;
			_.each( error, function(fieldName) {
				$('input[name=' + fieldName + model.id + ']').
					parents('.control-group').addClass('error');
			}, a );

			return success;
		},

		onInputGetFocus: function(e) {
			this.resetFieldError($(e.target).attr('name') );
		},

		resetFieldError: function(fieldName) {
			var $controlGroup =
				this.getFieldControlGroup(this.getField(fieldName));
			$controlGroup.removeClass('error');
		},

		getField: function(fieldName) {
			return $('input[name=' + fieldName + ']');
		},

		getFieldControlGroup: function($field) {
			return $field.parents('.control-group');
		},

		resetForm: function($form) {
			$form.validate().resetForm();
			$form.find('.success').removeClass('success');
			$form.find('.error').removeClass('error');
			$form.find('.valid').removeClass('valid');
		}
}

jQuery.validator.addMethod('phone', function(value, element) {
	if (value.length == 0) {
		return true;
	}
	return /^0\d \d\d \d\d \d\d \d\d$/i.test(value);
}, 'Expected phone number format:<br><i>0X XX XX XX XX</i>');

// Pas pratique, ça affiche le message d'erreur à l'intérieur du
// champ etc., il faut trouver autre chose pour vérifier que le nb
// de personnes ne dépasse pas la capacité de la chambre et soit > 0
// jQuery.validator.addMethod('nbPersons', function(value, element) {
	// return value > 0;
// }, 'The number of persons must be positive');

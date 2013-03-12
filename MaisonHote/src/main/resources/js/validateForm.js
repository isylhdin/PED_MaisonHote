window.validateForm = {

		onError: function(model, error, a) {
			success = false;
			_.each( error, function(fieldName) {	
				$('input[name=' + fieldName + model.id + ']').parents('.control-group').addClass('error');
			}, a );

			return success;
		},

		onInputGetFocus: function(e) {
			this.resetFieldError($(e.target).attr('name') );
		},

		resetFieldError: function(fieldName) {
			var $controlGroup = this.getFieldControlGroup(this.getField(fieldName));
			$controlGroup.removeClass('error');
		},

		getField: function(fieldName) {
			return $('input[name=' + fieldName + ']');
		},

		getFieldControlGroup: function($field) {
			return $field.parents('.control-group');
		}
}
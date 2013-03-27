window.CalendarView = Backbone.View.extend({

	events: {
		'click #submit' : 'onSubmit'
	},

	initialize: function() {
		// initialisation de la vue
		console.log('Calendar view initialized !');
		$(this.el).html(_.template(tpl.get('CalendarView')));
	},

	onSubmit: function() {
		console.log('submit!');

		var obj = JSON.parse(localStorage.getItem('fichier-backbone-resa.json'));
		updateFile(obj.idFichier, JSON.stringify(reservations.toJSON()),
				function(reponse) {
			if (!reponse.error) {
				$('#SaveRow').html(
					'<div id="goodResult" class="alert alert-success">' +
					'Vos modifications ont été sauvegardées avec succès !' +
					'</div>'
				);
				$('#SaveRow').fadeOut(3000, function() {
					$('#SaveRow').remove();
				});	
			} else if (!$('#badResult').length) {
				$('#SaveRow').append(
					'<div id="badResult" class="alert alert-error span2">' +
					'<strong>Sauvegarde échouée</strong>, ' +
					'veuillez vérifier que vous êtes connecté à Internet et ' +
					'réessayez</div>'
				);
			}
		});
	},

	close: function() {
		this.resasView.close();
		this.remove();
	}
});

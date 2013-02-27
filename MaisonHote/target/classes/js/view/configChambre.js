window.EditChambreView = Backbone.View.extend({

	initialize: function () {
		this.render();
		this.chambres();
	},

	render: function () {
		$(this.el).append("<div id='chambre'></div>");
		return this;
	},

	chambres: function (){

		var self = this;

		window.chambres = new Chambres();
		window.chambres.localStorage = new Backbone.LocalStorage("chambres-backbone");
		window.chambres.fetch({
			success: function(model, response, options) {
				chambres.each(function(Chambre){
					this.template = _.template(tpl.get('ChambreView'));
					$(self.el).append(this.template(Chambre.toJSON()));
<<<<<<< HEAD
//					console.log(chambres.toJSON());
//					console.log(model);
//					console.log(response);
//					console.log(options);
=======
					console.log(chambres.toJSON());
					console.log(model);
					console.log(response);
					console.log(options);
>>>>>>> 474e0a1ee9f346396c17db1b251c4035ec6fbf1f
				});
			}
		});

<<<<<<< HEAD
=======

		console.log("en dehors");

		console.log($(this.el));
>>>>>>> 474e0a1ee9f346396c17db1b251c4035ec6fbf1f
		console.log(chambres.toJSON());

		window.ls = new Backbone.LocalStorage("chambres-backbone");
		window.arrayChambres = ls.findAll();

		console.log(chambres.toJSON());
		return this;
	}
});
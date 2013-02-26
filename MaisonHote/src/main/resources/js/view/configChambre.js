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
		var chambres = new Chambres();
		chambres.localStorage = new Backbone.LocalStorage("chambres-backbone");
		chambres.fetch();	
		chambres.each(function(Chambre){
			this.template = _.template(tpl.get('ChambreView'));
			//ne marche pas pour append
			$(this.el).append(this.template(Chambre.toJSON()));
			$(this.el).append("<p> CA MARCHE </p>");
			console.log($(this.el));
			console.log("passage");
			console.log(chambres.toJSON());

		});
		console.log("en dehors");
		console.log(chambres.toJSON());
		return this;
	}
});
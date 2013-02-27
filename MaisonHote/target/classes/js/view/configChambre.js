window.EditChambreView = Backbone.View.extend({

	events : {
		"click .btn-danger"  : "onDelete",
		"click .btn-success"  : "onAdd",
		"click #submit"  : "onSubmit"

	},

	initialize: function () {
		this.render();
	},

	footpage : function(){
		$(this.el).append("<div class='row'> <a class='btn btn-success' href='#'><i class='icon-plus icon-white'></i> Ajouter</a></div>");
		$(this.el).append("<div class='row'><button type='submit' id='submit' class='btn'>Enregistrer</button></div>");
	},

	render: function (){
		$(this.el).append("<div id='chambre'></div>");

		var self = this;

		window.chambres = new Chambres();
		window.chambres.localStorage = new Backbone.LocalStorage("chambres-backbone");
		window.chambres.fetch({
			success: function(model, response, options) {
				chambres.each(function(Chambre){
					this.template = _.template(tpl.get('ChambreView'));
					$(self.el).append(this.template(Chambre.toJSON()));
				});
			}
		});

		this.footpage();
		console.log(chambres.toJSON());
		return this;
	},

	onDelete: function(event){
		console.log("clic delete !");

	},
	
	onAdd: function(event){
		console.log("clic add !");

	},
	
	onSubmit: function(event){
		console.log("clic submit!");

	}
	
});
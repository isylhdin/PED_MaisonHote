window.EditChambreView = Backbone.View.extend({

	initialize: function () {
		this.render();
		var chambres = new Chambres();
		chambres.localStorage = new Backbone.LocalStorage("chambres-backbone");
		chambres.fetch({ 
			success:function() {
				chambres.each(function(Chambre){
					this.template = _.template(tpl.get('ChambreView'));
					$(this.el).append(this.template(Chambre.toJSON()));
					console.log(Chambre);
				});
			}
		});	
	},

	render: function () {
		$(this.el).append("<div id='chambre'></div>");
		return this;
	}
});
window.SelectMaisonView = Backbone.View.extend({

	events : {
		"click #1" : "un",
		"click #2" : "deux",
		"click #3" : "trois",
		"click #4" : "quatre",
		"click #5" : "cinq"
	},

	initialize: function () {
		this.render();
		
	},

	render: function () {
		$(this.el).html(_.template(tpl.get('SelectMaisonView')));
		$(this.el).append("<div id='maison'></div>");
		return this;
	},

	un : function(event){
		$('#maison').empty();
		$('#maison').append(_.template(tpl.get('MaisonView')));
		$('#maison').append("<button type='submit'>Enregistrer</button>");

		
	},

	deux : function(event){
		$('#maison').empty();
		for(i=0;i<2;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		$('#maison').append("<button type='submit'>Enregistrer</button>");
	},
	
	trois : function(event){
		$('#maison').empty();
		for(i=0;i<3;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		$('#maison').append("<button type='submit'>Enregistrer</button>");
	},
	
	quatre : function(event){
		$('#maison').empty();
		for(i=0;i<4;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		$('#maison').append("<button type='submit'>Enregistrer</button>");
	},
	
	cinq : function(event){
		$('#maison').empty();
		for(i=0;i<5;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		$('#maison').append("<button type='submit'>Enregistrer</button>");
	}
});

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
	},

	deux : function(event){
		for(i=0;i<2;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
	},
	
	trois : function(event){
		for(i=0;i<3;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
	},
	
	quatre : function(event){
		for(i=0;i<4;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
	},
	
	cinq : function(event){
		for(i=0;i<5;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
	}


});

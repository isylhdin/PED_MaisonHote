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
	
	submit : function(){
		$('#maison').append("<div class='row'><button type='submit' class='btn'>Enregistrer</button></div>");
	},

	un : function(event){
		$('#maison').empty();
		$('#maison').append(_.template(tpl.get('MaisonView')));
		this.submit();
	},

	deux : function(event){
		$('#maison').empty();
		for(i=0;i<2;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		this.submit();
	},
	
	trois : function(event){
		$('#maison').empty();
		for(i=0;i<3;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		this.submit();
	},
	
	quatre : function(event){
		$('#maison').empty();
		for(i=0;i<4;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		this.submit();

	},
	
	cinq : function(event){
		$('#maison').empty();
		for(i=0;i<5;i++){
			$('#maison').append(_.template(tpl.get('MaisonView')));
		}
		this.submit();

	}
});

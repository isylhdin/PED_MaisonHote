window.EditChambreView = Backbone.View.extend({

	initialize: function () {
		var chambres = new Chambres();
		chambres.bind('reset', this.render);
		
		chambres.fetch({ 
		    success:function() {
		        console.log(chambres.toJSON());
		    }
		}); //Attention c'est asynchrone
		console.log(chambres);
		
		
//		this.template = _.template(tpl.get('ChambreView'));
//		$('#content').append("<div id='maison'></div>");
//		chambres.each(function(Chambre){
//			$('#maison').append(template(Chambre.toJSON()));
//		});
		
	},
	
	render: function(){
		console.log("on est dans render");
        console.log(chambres.toJSON());
    }


});
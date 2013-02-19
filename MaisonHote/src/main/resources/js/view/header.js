window.HeaderView = Backbone.View.extend({

	events : {
		"click #deconnexion" : "buttonClickHandler"
	},
	
    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(_.template(tpl.get('HeaderView')));
        return this;
    }
    ,
    
    buttonClickHandler : function(event){
    	app.connexion();
    }
});
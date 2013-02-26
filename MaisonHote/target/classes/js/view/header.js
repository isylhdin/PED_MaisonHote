window.HeaderView = Backbone.View.extend({

	events : {
		"click #deconnexion" : "buttonClickHandler",
		"click #fr"			 : "fr",
		"click #en"			 : "en"
	},
	
    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(_.template(tpl.get('HeaderView')));
        return this;
    },
    
    buttonClickHandler : function(event){
    	app.connexion();
    },
    
    fr : function() {
      var language = 'fr';
      $.ajax({
        url: 'language.xml',
        success: function(xml) {
          $(xml).find('translation').each(function(){
            var id = $(this).attr('id');
            var text = $(this).find(language).text();
            $("#" + id).html(text);
          });
        }
      });
    },
    
    en : function() {
      var language = 'en';
      $.ajax({
        url: 'languages.xml',
        success: function(xml) {
          $(xml).find('translation').each(function(){
            var id = $(this).attr('id');
            var text = $(this).find(language).text();
            $("#" + id).html(text);
          });
        }
      });
    } 
});
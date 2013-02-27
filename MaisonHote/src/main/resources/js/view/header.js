window.HeaderView = Backbone.View.extend({

	events : {
		"click #deconnexion" : "buttonClickHandler",
		"click .dropdown-menu a" : "buttonLangage",
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
    
    buttonLangage : function click(id) {
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
         url: 'language.xml',
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
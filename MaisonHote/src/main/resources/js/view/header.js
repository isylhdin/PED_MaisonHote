window.HeaderView = Backbone.View.extend({

	events : {
		"click #logOut" : "buttonClickHandler",
		"click .dropdown-menu li a" : "buttonLanguage"
		 // "click #fr"			 : "fr",
		 // "click #en"			 : "en"
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
    	$('#room').hide();
		$('#logOut').hide();
		//$('#nameAppli').hide();
		document.getElementById('nameAppli').href = null;
		$('#service').hide();
		$('#listCustomer').hide();
		localStorage.clear();	
    },
    
    buttonLanguage : function(l) {
    var language = l.currentTarget.id;
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

     // change the flag on the header according the current language
     document.getElementById('testFlag').src = "css/img/flag" + language.toUpperCase() + ".gif";
    }
       
     // fr : function() {
       // var language = 'fr';
       // $.ajax({
         // url: 'languages.xml',
         // success: function(xml) {
           // $(xml).find('translation').each(function(){
             // var id = $(this).attr('id');
             // var text = $(this).find(language).text();
             // $("#" + id).html(text);
           // });
         // }
       // });
     // },
//      
     // en : function() {
       // var language = 'en';
       // $.ajax({
         // url: 'languages.xml',
         // success: function(xml) {
           // $(xml).find('translation').each(function(){
             // var id = $(this).attr('id');
             // var text = $(this).find(language).text();
             // $("#" + id).html(text);
           // });
         // }
       // });
     // } 
});
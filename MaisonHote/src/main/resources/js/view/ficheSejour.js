window.ficheSejourView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
//    	console.log(jQuery.parseJSON(this.model));
//    	console.log(this.model);

    	this.template = _.template(tpl.get('ficheSejourView'));
    	$(this.el).html(this.template(this.model));
		
        return this;
    },
});

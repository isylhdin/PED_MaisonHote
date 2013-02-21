window.ConfigMaisonView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(_.template(tpl.get('ConfigMaisonView')));
        return this;
    },
});

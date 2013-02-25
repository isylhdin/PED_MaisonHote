window.ServiceView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(_.template(tpl.get('ServiceView')));
        return this;
    },
});
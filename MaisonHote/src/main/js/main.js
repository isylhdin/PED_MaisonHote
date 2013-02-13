(function($) {

        window.Doc = Backbone.Model.extend({

            defaults : {
                id : "???",
                title : "Doc Title",
                text : "Bla bla bla",
                keywords : "word1, word2, word3, ..."
            },

            initialize : function Doc() {
                console.log('Doc Constructor');
            }
        });


    })(Jquery);


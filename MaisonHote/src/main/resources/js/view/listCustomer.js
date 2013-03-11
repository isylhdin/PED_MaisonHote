window.ListCustomerView = Backbone.View.extend({
	
	events: {
		"click #btnSearchCustomer"   : "searchCustomer"
	},

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(_.template(tpl.get('ListCustomerView')));
        return this;
    },
    
    searchCustomer: function (){
    	var size = document.getElementById('selectCustomer').options.length;
    	for(i=0;i<size;i++){	
//    		console.log(document.getElementById('i').text);
//			console.log(document.getElementById('inputSearch').value);
    		if(document.getElementById("'"+i+"'").text == document.getElementById('inputSearch').value){
    			console.log("dans boucle");
    			document.getElementById('i').active();
    		}
    	  }
    	
    }
    
});
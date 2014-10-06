define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');
    var UnsupportedView = require('extensions/adapt-unsupported/js/adapt-unsupportedView');

    // Listen to when the data is all loaded
    Adapt.on('app:dataReady', function() {

    	var config = Adapt.course.get("_unsupported");
    	if (config && config._isEnabled) {
    		var model = new Backbone.Model(config);
    		new UnsupportedView({model: model});
    	}

    });

});
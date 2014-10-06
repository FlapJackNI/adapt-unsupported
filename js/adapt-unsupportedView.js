define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var UnsupportedView = Backbone.View.extend({

        className: "extension-unsupported",

        initialize: function () {
            this.preRender();
            this.render();
        },

        preRender: function() {
            this.listenTo(Adapt, "device:resize", this.onScreenSizeChanged);
            this.checkSupport();
        },

        render: function () {
            var data = this.model.toJSON();
            var template = Handlebars.templates["unsupported"];
            this.$el.html(template(data)).appendTo('#wrapper');
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
            console.log(this.model);
            return this;
        },

        postRender: function() {},

        checkSupport: function() {
            var unsupported = false;
            if (this.checkScreenSize() || this.checkBrowser()) {
                unsupported = true;
            }
            this.model.set({
                _showUnsupported: unsupported
            });
        },

        checkScreenSize: function() {
            var unsupported = false;
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var screenSize = this.model.get("_screenSize");
            if (windowWidth < screenSize._minimumWidth || windowHeight < screenSize._minimumHeight) {
                unsupported = true;
            }
            this.model.set({
                _screenSizeUnsupported: unsupported
            });
            return unsupported;
        },

        checkBrowser: function() {
            var unsupported = true;
            var supportedBrowsers = this.model.get("_browser")._supported;
            for (var i = 0; i < supportedBrowsers.length; i++) {
                if ($("html").hasClass(supportedBrowsers[i])) {
                    unsupported = false;
                    break;
                }
            }
            this.model.set({
                _browserUnsupported: unsupported
            });
            return unsupported;
        },

        onScreenSizeChanged: function() {
            this.checkSupport();
            this.render();
        }

    });

    return UnsupportedView;

});
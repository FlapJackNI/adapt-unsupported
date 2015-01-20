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
            var screenSize = this.model.get("_screenSize");

            if (screenSize) {
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();

                if (windowWidth < screenSize._minimumWidth || windowHeight < screenSize._minimumHeight) {
                    unsupported = true;
                }
            }
    
            this.model.set({
                _screenSizeUnsupported: unsupported
            });
            return unsupported;
        },

        checkBrowser: function() {
            var unsupported = true;
            var supportedBrowsers = this.model.get('_browser')._supported;
            var browserCollection = new Backbone.Collection(supportedBrowsers);
            var detectedBrowser = Adapt.device.browser;
            var detectedBrowserVersion = parseInt(Adapt.device.version);
            var supportedBrowser = browserCollection.findWhere({name: detectedBrowser});

            if (supportedBrowser) {
                var unsupportedVersions = supportedBrowser.get('_unsupported');
                if (_.indexOf(unsupportedVersions, detectedBrowserVersion) == -1) {
                    unsupported = false;
                } else {
                    unsupported = true;
                }
            } else {
                unsupported = true;
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

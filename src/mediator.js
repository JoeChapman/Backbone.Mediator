(function(factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
      define(['underscore', 'backbone'], factory);
  } else {
      if (_ && Backbone) {
          factory(_, Backbone);
      }
  }

})(function (_, Backbone) {

    'use strict';

    var currentEvent,
        passes = {};

    function add( type, obj, eventName ) {
        passes[ currentEvent ][ type ].push({
            obj: obj,
            eventName: eventName
        });
    }

    function registerBindings() {

        _.each( passes[ currentEvent ], function (sources, type, passes) {

            _.each( passes, function ( sources, type, pass ) {

                _.each( pass.from, function ( from ) {

                    // Remove any previous registerBindingsing
                    from.obj.off( from.eventName );

                    // Bind the event to a callback
                    from.obj.on( from.eventName, function( args ) {

                        _.each( pass.to, function ( to ) {

                            // The callback registerBindingss the |to| event
                            to.obj.trigger( to.eventName, args);

                        }, this);

                    }, this);

                }, this);

            }, this);

        }, this);

    }

    function register() {

        var config = arguments[0];

        if ( config ) {

            if ( config.source ) {

                _.each(config.source, function ( from ) {

                    mediator.from( from.subscriber, from.event );

                }, this);

            } else {

                throw {
                    name: "ConfigSourceNotDefined",
                    message: "Config object needs a source defined."
                };

            }

            if ( config.target ) {

                _.each( config.target, function (to) {

                    this.to( to.subscriber, to.event );

                }, this);

            } else {

                throw {
                    name: "ConfigTargetNotDefined",
                    message: "Config object needs a target defined."
                };
            }

        } else {
            registerBindings.call(this);
        }

    }

    function unregister( config ) {

        if ( !config ) {

            throw {
                name: "NoArgumentException",
                message: "Unregister cannot be called without arguments"
            };

        }

        if ( config ) {

            this.removing = true;

            if ( config.target ) {

                _.each( config.target, function ( to ) {

                    this.remove( to.subscriber, to.event );

                }, this );

            } else {

                throw {
                    name: "ConfigTargetNotDefined",
                    message: "Config object needs a target defined."
                };

            }

            if ( config.source ) {

                _.each(config.source, function (from) {

                    mediator.from(from.subscriber, from.eventName);

                }, this );

            } else {

                throw {
                    name: "ConfigSourceNotDefined",
                    message: "Config object needs a source defined."
                };

            }

        }

    }

    var mediator = {

        from: function (subscribee, eventName) {

            if (!arguments.length) {

                throw {
                    name: "NoArgumentsException",
                    message: "From cannot be called with no arguments"
                };

            }

            currentEvent = eventName || 'all';

            if ( !passes[ currentEvent ] ) {
                passes[ currentEvent ] = {};
            }

            if ( !passes[ currentEvent ].from ) {
                passes[ currentEvent ].from = [];
            }

            add.call( this, "from", subscribee, eventName );

            if ( this.removing ) {

                // Has to object been marked for removal??
                _.each( passes, function ( pass, j ) {

                    _.each( pass.to, function ( to, i) {

                        if (pass.to[i].remove && pass.to[i].remove === true) {
                            // Delete the target object and event,
                            // null the currentEvent
                            delete passes[j].to[i];
                            currentEvent = null;

                        }

                    }, this);

                }, this);

                this.removing = false;
            }
            // Make it chainable
            return this;

        },

        to: function ( subscriber, eventName ) {

            if ( !currentEvent ) {

                throw {
                    name: "ToFunctionBadUsage",
                    message: "Cannot call to before from."
                };

            }

            if ( !passes[ currentEvent ].to ) {
                passes[ currentEvent ].to = [];
            }

            add.call( this, "to", subscriber, eventName );

            // No config object parameter
            register.call(this);

            // Make it chainable
            return this;
        },

        remove: function (obj, eventName) {

            if (!arguments.length) {

                throw {
                    name: "NoArgumentException",
                    message: "Remove cannot be called without arguments"
                };

            }

            this.removing = true;

            _.each(passes, function ( pass ) {

                _.each( pass.to, function ( to, i ) {

                    if (typeof obj == "string") {

                        eventName = obj;

                        if ( to.eventName === eventName ) {

                            [].splice.call(pass.to, i, 1);

                        }

                    } else {

                        if ( ( _.isEqual(to.obj, obj) || obj == null ) && ( to.eventName === eventName || typeof eventName == "undefined" ) ) {

                            to.remove = true;

                        }

                    }

                });

            });

            return this;

        }

    };

    _.extend((Backbone.Mediator = {}), mediator);

    return Backbone;

});

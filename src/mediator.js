define( function ( require, exports, module ) {

	var utils = require('utils');
	var events = require('events');

	var	helpers = {

			/**
			* A little help to keep it DRY
			* @param type {String} to|from
			* @param obj {Object}
			* @param eventName {String}
			* @private
			*/
			add: function add ( type, obj, eventName ) {

				passes[ currentEvent ][ type ].push({
					obj: obj,
					eventName: eventName
				});

			},

			/**
			* Bind one or more target events to one or more source events
			* @private
			*/
			bind: function bind () {

				utils.each( passes[ currentEvent ], function (sources, type, passes) {

					utils.each( passes, function ( sources, type, pass ) {

						utils.each( pass.from, function ( from ) {

							// Remove any previous binding
							from.obj.off( from.eventName );

							// Bind the event to a callback
							from.obj.on( from.eventName, function( args ) {

								utils.each( pass.to, function ( to ) {

									// The callback binds the |to| event
									to.obj.fire( to.eventName, args);

								}, this);

							}, this);

						}, this);

					}, this);

				}, this);

			}

		},

		passes = {},

		currentEvent = null;

	var mediator = {

		/**
		* Registers the source subject subscriber and its event(s)
		* @param subscribee {Object}
		* @param eventName {String}
		* @return {this}
		*/

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

			helpers.add( "from", subscribee, eventName );

			if ( this.removing ) {

				// Has to object been marked for removal??
				utils.each( passes, function ( pass, j ) {

					utils.each( pass.to, function ( to, i) {

						if (pass.to[i].remove && pass.to[i].remove === true) {
							// Dedlete the target object and event,
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


		/**
		* Adds a target subscriber by eventName to the mediator
		* @param subscriber {Object}
		* @param eventName {String}
		* @return {this}
		*/
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

			helpers.add( "to", subscriber, eventName );

			// No config object parameter
			this.register();

			// Make it chainable
			return this;
		},

		/**
		* Marks target and eventName for removal
		* @param target {Object}
		* @param eventName {String}
		* @return {this}
		*/
		remove: function (obj, eventName) {

			if (!arguments.length) {

				throw {
					name: "NoArgumentException",
					message: "Remove cannot be called without arguments"
				};

			}

			this.removing = true;

			utils.each(passes, function ( pass ) {

				utils.each( pass.to, function ( to, i ) {

					if (typeof obj == "string") {

						eventName = obj;

						if ( to.eventName === eventName ) {

							[].splice.call(pass.to, i, 1);

						}

					} else {

						if ( ( utils.isEqual(to.obj, obj) || obj == null ) && ( to.eventName === eventName || typeof eventName == "undefined" ) ) {

							to.remove = true;

						} 

					}

				});

			});

			return this;

		},

		/**
		* Registers the source and target subscriber objects and their events for binding
		* @param optional config Object
		*/
		register: function () {

			var config = arguments[0];

			if ( config ) {

				if ( config.source ) {

					utils.each(config.source, function ( from ) {

						this.from( from.subscriber, from.event );

					}, this);

				} else {

					throw {
						name: "ConfigSourceNotDefined",
						message: "Config object needs a source defined."
					};

				}

				if ( config.target ) {

					utils.each( config.target, function (to) {

						this.to( to.subscriber, to.event );

					}, this);

				} else {

					throw {
						name: "ConfigTargetNotDefined",
						message: "Config object needs a target defined."
					};
				}

			} else { 
				helpers.bind(); 
			}

		},

		/**
		* Notifies mediator that target and source subscriber and events should be removed.
		* @param config {Object}
		*/
		unregister: function ( config ) {

			if ( !config ) {

				throw {
					name: "NoArgumentException",
					message: "Unregister cannot be called without arguments"
				};

			}

			if ( config ) {

				this.removing = true;

				if ( config.target ) {

					utils.each( config.target, function ( to ) {

						this.remove( to.subscriber, to.event );

					}, this );

				} else {
					
					throw {
						name: "ConfigTargetNotDefined",
						message: "Config object needs a target defined."
					};

				}

				if ( config.source ) {

					utils.each(config.source, function (from) {

						this.from(from.subscriber, from.eventName);

					}, this );

				} else {

					throw {
						name: "ConfigSourceNotDefined",
						message: "Config object needs a source defined."
					};

				}

			}

		}

	};

	return mediator;

});
define( function ( require, exports, module ) {

	var events = {

		list: {},

		on: function (event, callback) {

			var context;

			if ( "string" != typeof event ) {
				throw new Error("on() needs an event name string");
			}

			if ( "function" != typeof callback ) {
				throw new Error("on() needs a callback function");
			}

			context = [].slice.call( arguments, 2 )[0];

			if ( !this.list[event] ) {
				this.list[event] = [];
			}

			this.list[event].push({ 
				callback: callback, 
				context: context 
			});

		},

		reset: function () {
			this.list = {};
		},

		off: function (event) {

			var ev, len, cb;

			// Event must be a string
			if ( "string" != typeof event ) {
				throw new Error( "off() needs an event" );
			}

			cb = [].slice.call( arguments, 1 )[0];

			// If the event has been registered
			if ( this.list[event] ) {

				ev = this.list[event];
				len = ev.length;

				// Loop over each event object that matches ours.
				while ( len-- ) {

					if ( "function" != typeof cb ) {
						// If no callback was given, remove the event
						// and all its callbacks
						ev.splice(len, 1);

					} else {
						// If a callback was passed, 
						// remove the callback from the event
						if ( ev[len].callback === cb ) {

							ev[len].callback = null;

							delete ev[len].callback;
						
						}

					}

				} 

			}  

		},

		fire: function ( event ) {

			var ev, len, opt, data, ctx;

			// event argument is mandatory
			if ( "string" != typeof event ) {
				throw new Error("fire() needs an event");
			}

			// Optional arguments
			opt = [].slice.call( arguments, 1 );
			data = opt[0];
			ctx = opt[1];

			// If this event has been registered
			if ( this.list[event] ) {

				len = this.list[event].length; 

				// Invoke the callback on each event object
				while ( ev = this.list[event][--len] ) {

					if ("function" == typeof ev.callback) {

						// Invoke in either context with data if present
						ev.callback.call( ( ctx || ev.context || this ), data );

					}

				}

			}

		}

	};
 
	return events;

});

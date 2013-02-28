define( function ( require, exports, module ) {

	var utils = {

		isObject: function ( o ) {
			// Concat Object with string to 
			// invoke toString() and test class definition
			return "[object Object]" === ''+o;
		},

		realTypeOf: function ( value ) { 
			// Borrow Object.toString to introspect the
			// class definition of the value i.e. ([object Object]) 
			// and return the latter portion which denotes 
			// the real type of the input value.
			return ({}).toString.call(value).match( /\w+/g )[1].toLowerCase();
		},

		mixin: function( dest, source, deep ) {

			for (var property in source) {

				// Iterate over all source properties
				if ( deep && "object" == typeof source[property] ) {
					dest[property] = dest[property] || {};

					// If the value is an object itself, then we need to recurse
					// to to perform a deep copy; Objects copy by refernce
					utils.mixin( dest[property], source[property] );
				} else {

					// Assign the value form the source to the destination
					dest[property] = source[property];
				}
			}
			return dest;
		},

		isEqual: function (a, b) {

			if (a === b) {
				return a !== 0 || 1 / a === 1 / b;
			}

			if (a === null || b === null) {
				return a === b;
			}

			if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
				return false;
			}

		},

		// Polyfill for native ForEach
		each: function (list, callback, context) {

			var i;

			// Native forEach
			if (typeof Array.prototype.forEach == "function" && list.length) {

				list.forEach( callback, context || this);

			} else if ( list.length ) {

				// Polyfill
				Array.prototype.forEach = function( callback, context ) {

					for (var i = 0, len = list.length; i < len; ++i) {

						callback.call(context, list[i], i, list);

					}

				};

			} else {

				// If the list is an [object Object] (i.e. Not an Array)
				for ( i in list ) {

					if ( list.hasOwnProperty( i ) ) {
					
						callback.call( context || this, list[i], i, list );
					
					}
				
				}

			}

		}

	};

	return utils;

});
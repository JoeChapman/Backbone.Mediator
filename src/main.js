define( function ( require, exports, module ) {

	var utils = require('utils');
	var events = require('events');
	var mediator = require('mediator');

	return utils.mixin( mediator, events );

});
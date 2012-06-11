describe("Given Eventitus", function () {
	beforeEach(function () {
		Eventitus = Eventitus;
	});
	afterEach(function () {
		Eventitus.events = {};
	})
	describe("When I add an event 'newEvent' and a function called 'fn'", function () {
		beforeEach(function () {
			Eventitus.on('newEvent', function fn() {});
		});
		it("Then 'newEvent' is added", function () {
			expect(Eventitus.events['newEvent']).toBeDefined();
		});
		it("Then 'fn' becomes the callBack of 'newEvent'", function () {
			expect(Eventitus.events['newEvent'][0].fn.name).toBe('fn');
		});
	});
	describe("When I add 3 fn1, 2 & 3 to the event 'newEvent'", function () {
		beforeEach(function () {
			Eventitus.on('newEvent', function fn1 () {});
			Eventitus.on('newEvent', function fn2 () {});
			Eventitus.on('newEvent', function fn3 () {});
		});
		it("Then fn1 becomes a callback to 'newEvent'", function () {
			expect(Eventitus.events['newEvent'][0].fn.name).toEqual('fn1');
		});
		it("Then fn2 becomes a callBack to 'newEvent'", function () {
			expect(Eventitus.events['newEvent'][1].fn.name).toBe('fn2');
		});
		it("Then fn3 becomes a callBack to 'newEvent'", function () {
			expect(Eventitus.events['newEvent'][2].fn.name).toBe('fn3');
		});
	});
	describe("Adding an event without a callBack function", function () {
		it("Should not add the new event", function () {
			Eventitus.on('newEvent');
			expect(Eventitus.events['newEvent']).not.toBeDefined();
		});
	});
	describe("Removing an event", function () {
		it("Removes the entire event and associated callBacks", function () {
			Eventitus.on('newEvent');
			Eventitus.off('newEvent');
			expect(Eventitus.events['newEvent']).not.toBeDefined();
		});
	});
	describe("Removing a callBack when multiple callBacks are registered", function () {
		var callBack1 = function () {},
			callBack2 = function () {},
			callBack3 = function () {},
			callBack4 = function () {};
		beforeEach(function () {
			Eventitus.on('newEvent', callBack1);
			Eventitus.on('newEvent', callBack2);
			Eventitus.on('newEvent', callBack3);
			Eventitus.on('newEvent', callBack4);
			Eventitus.off('newEvent', callBack2);
		});
		it("Removes the callBack function", function () {
			expect(Eventitus.events['newEvent'][1].fn).not.toBeDefined();
		});
		it("Does not remove the event", function () {
			expect(Eventitus.events['newEvent']).toBeDefined();
		});
	});
	describe("Firing an event", function () {
		var data = {name: 'Joe'},
			expectedData;
		beforeEach(function () {
			callBack = function (data) { expectedData = data; };
			Eventitus.on('newEvent', callBack);
		});
		afterEach(function () {
			callBack = null;
			Eventitus.off('newEvent', callBack);
		});
		describe("With data", function () {
			it("Does not throw an error", function () {
				expect(function () {
					Eventitus.fire('newEvent', data);
				}).not.toThrow();
			});
			it("Passes the same data to the callBack", function () {
				Eventitus.fire('newEvent', data);
				expect(data).toEqual(expectedData);
				expect(expectedData.name).toBe('Joe');
			});
		});
		describe("Without data", function () {
			it("Does not throw an error", function () {
				expect(function () {
					Eventitus.fire('newEvent');
				}).not.toThrow();
			});
		});
	});
	describe("Firing an event without a callBack", function () {
		var callBack = null;
		it("Throws an error", function () {
			Eventitus.on('newEvent', callBack);
			expect(function () {
				Eventitus.fire('newEvent');
			}).toThrow({
				name: "CallbackError",
				message: "Cannot call null callBack"
			});
		});
	});
	describe("Return 'PAUSE' in a callBack", function () {
		var functions = {},
			cB1Fired = false, cB2Fired = false, cB3Fired = false, cB4Fired = false,
			callBack1 = function () { cB1Fired = true; },
			callBack2 = function () { cB2Fired = true; return 'PAUSE'; },
			callBack3 = function () { cB3Fired = true; },
			callBack4 = function () { cB4Fired = true; };
		it("Stops all subsequent callBacks from firing", function () {
			Eventitus.on('newEvent', callBack1);
			Eventitus.on('newEvent', callBack2);
			Eventitus.on('newEvent', callBack3);
			Eventitus.on('newEvent', callBack4);
			Eventitus.fire('newEvent');
			expect(cB1Fired).toBe(true);
			expect(cB2Fired).toBe(true);
			expect(cB3Fired).toBe(false);
			expect(cB4Fired).toBe(false);
		});
	});
});
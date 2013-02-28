require( ['utils'], function ( utils ) {

	describe("utils", function () {

		describe("utils.isObject", function () {

			describe("When isObject is called with an real Object", function () {
				it("Should return true", function () {
					expect(utils.isObject({})).toEqual(true);
				});
			});
			describe("When isObject is called with an Array", function () {
				it("Should return false", function () {
					expect(utils.isObject([])).toEqual(false);
				});
			});
			describe("When isObject is called with a Function", function () {
				it("Should return false", function () {
					expect(utils.isObject(function () {})).toEqual(false);
				});
			});
			describe("When isObject is called with a Date", function () {
				it("Should return false", function () {
					expect(utils.isObject(Date.now())).toEqual(false);
				});
			});
			describe("When isObject is called with a RegExp", function () {
				it("Should return false", function () {
					expect(utils.isObject(/\d+/)).toEqual(false);
				});
			});
			describe("When isObject is called with a String", function () {
				it("Should return false", function () {
					expect(utils.isObject("string")).toEqual(false);
				});
			});
			describe("When isObject is called with a Number", function () {
				it("Should return false", function () {
					expect(utils.isObject(1)).toEqual(false);
				});
			});
			describe("When isObject is called with arguments", function () {
				it("Should return false", function () {
					expect(utils.isObject(arguments)).toEqual(false);
				});
			});

		});

		describe("utils.realTypeOf", function () {

			describe("When realTypeOf is called with an Object", function () {
				it("Should return 'object'", function () {
					expect(utils.realTypeOf({})).toEqual("object");
				});
			});
			describe("When realTypeOf is called with an Array", function () {
				it("Should return 'array'", function () {
					expect(utils.realTypeOf([])).toEqual("array");
				});
			});
			describe("When realTypeOf is called with a Function", function () {
				it("Should return 'function'", function () {
					expect(utils.realTypeOf(function () {})).toEqual("function");
				});
			});
			describe("When realTypeOf is called with a String", function () {
				it("Should return 'string'", function () {
					expect(utils.realTypeOf("string")).toEqual("string");
				});
			});
			describe("When realTypeOf is called with a Number", function () {
				it("Should return 'number'", function () {
					expect(utils.realTypeOf(1)).toEqual("number");
				});
			});
			describe("When realTypeOf is called with a RegExp", function () {
				it("Should return 'regexp'", function () {
					expect(utils.realTypeOf(/\d+/)).toEqual("regexp");
				});
			});
			describe("When realTypeOf is called with arguments", function () {
				it("Should return 'arguments'", function () {
					expect(utils.realTypeOf(arguments)).toEqual("arguments");
				});
			});
		});
	});

});

require(['underscore', 'backbone'], function ( _, Backbone ) {

  'use strict';

  describe("Mediator", function () {

    describe("Given the Backbone.Events are registered in a functional, API style", function () {

      var data = {
        page: 1,
        totalResults: 1000
      };

      describe("Given a 'event:target' is registered on a target object to 'event:source' on a source object", function () {

        var source, target;

        beforeEach(function () {

          source = _.extend({ name: 'source' }, Backbone.Events);
          target = _.extend({ name: 'target' }, Backbone.Events);

          // The registration 'API-style'
          Backbone.Mediator.from( source , "event:source" ).to( target, "event:target" );

        });

        describe("When 'event:source' is triggerd on the source object", function () {

          var spyTargettrigger;

          beforeEach(function () {
            spyTargettrigger = spyOn( target, "trigger" ).andCallThrough();
            source.trigger("event:source", data );
          });

          it("Should triggerd 'event:target' event on the target object", function() {
           expect(spyTargettrigger).toHaveBeenCalledWith("event:target", data);
          });

          it("Should ONLY trigger the event once", function () {
            expect(spyTargettrigger.callCount).toEqual(1);
          });

        });

      });

      describe("Given a 'event:target' is registered on 2 target objects to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {

          source = _.extend({ name: 'source' }, Backbone.Events);
          target1 = _.extend({ name: 'trget1' }, Backbone.Events);
          target2 = _.extend({ name: 'target2' }, Backbone.Events);

          // The registration 'API-style'
          Backbone.Mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target2, "event:target" );

        });

        describe("When 'event:source' is triggerd on the source object", function () {

          var spyTarget1trigger, spyTarget2trigger;

          beforeEach(function () {

            spyTarget1trigger = spyOn( target1, "trigger").andCallThrough();
            spyTarget2trigger = spyOn( target2, "trigger").andCallThrough();

            source.trigger("event:source", data);

          });

          it("Should trigger 'event:target' on the first target object", function() {
            expect(spyTarget1trigger).toHaveBeenCalledWith("event:target", data);
          });

          it("Should ONLY trigger the event on the first target ONCE", function () {
            expect(spyTarget1trigger.callCount).toEqual(1);
          });

          it("Should trigger 'event:target' on the second target object", function() {
            expect(spyTarget2trigger).toHaveBeenCalledWith("event:target", data);
          });

          it("Should ONLY trigger the event on the second target ONCE", function () {
            expect(spyTarget2trigger.callCount).toEqual(1);
          });

        });

      });

      describe("Given a 'event:target' is registered on 2 target objects to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {

          source = _.extend({ name: 'source' }, Backbone.Events);
          target1 = _.extend({ name: 'target1' }, Backbone.Events);
          target2 = _.extend({ name: 'target2' }, Backbone.Events);

          // The registration 'API-style'
          Backbone.Mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target2, "event:target" );
        });

        describe("When 'event:target' on the first object is removed from 'event:source' on the source object", function () {

          beforeEach(function () {

            Backbone.Mediator.remove( target1, "event:target" ).from( source , "event:source" );

          });

          describe("When 'event:source' is triggerd on the source object", function () {

            var spyTarget1trigger, spyTarget2trigger;

            beforeEach(function () {

              spyTarget1trigger = spyOn( target1, "trigger").andCallThrough();
              spyTarget2trigger = spyOn( target2, "trigger").andCallThrough();

              source.trigger("event:source", data );

            });

            it("Should NOT trigger 'event:target' on the first target object", function() {
              expect(spyTarget1trigger).not.toHaveBeenCalledWith("event:target", data);
            });

            it("Should trigger 'event:target' on the second target object", function() {
              expect(spyTarget2trigger).toHaveBeenCalledWith("event:target", data);
            });

            it("Should ONLY trigger the event on the second target ONCE", function () {
              expect(spyTarget2trigger.callCount).toEqual(1);
            });

          });

        });

      });

      describe("Given a 'event:target' and 'event:other' is registered on 1 target object to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {

          source = _.extend({ name: 'source' }, Backbone.Events);
          target1 = _.extend({ name: 'target1' }, Backbone.Events);

          // The registration 'API-style'
          Backbone.Mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target1, "event:other" );

        });

        describe("When target1' is removed from 'event:source' on the source object", function () {

          beforeEach(function () {

            Backbone.Mediator.remove( target1 ).from( source , "event:source" );

          });

          describe("When 'event:source' is triggerd on the source object", function () {

            var spyTarget1trigger;

            beforeEach(function () {

              spyTarget1trigger = spyOn( target1, "trigger").andCallThrough();

              source.trigger("event:source", data );

            });

            it("Should NOT trigger 'event:target' on the first target object", function() {
              expect(spyTarget1trigger).not.toHaveBeenCalledWith("event:target", data);
            });

            it("Should NOT trigger 'event:other' on the first target object", function() {
              expect(spyTarget1trigger).not.toHaveBeenCalledWith("event:other", data);
            });

          });

        });

      });

      describe("Given a 'event:target' and 'event:other' is registered on 1 target object to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {
          source = _.extend({ name: 'source' }, Backbone.Events);
          target1 = _.extend({ name: 'target1' }, Backbone.Events);

          // The registration 'API-style'
          Backbone.Mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target1, "event:other" );

        });

        describe("When 'event:other' is removed from 'event:source' on the source object", function () {

          beforeEach(function () {

            Backbone.Mediator.remove( "event:other" );

          });

          describe("When 'event:source' is triggerd on the source object", function () {

            var spyTarget1trigger;

            beforeEach(function () {

              spyTarget1trigger = spyOn( target1, "trigger").andCallThrough();

              source.trigger("event:source", data );

            });

            it("Should trigger 'event:target' on the first target object", function() {
              expect(spyTarget1trigger).toHaveBeenCalledWith("event:target", data);
            });

            it("Should NOT trigger 'event:other' on the first target object", function() {
              expect(spyTarget1trigger).not.toHaveBeenCalledWith("event:other", data);
            });

          });

        });

      });

    });

  });

});
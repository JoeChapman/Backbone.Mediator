require( ['mediator', 'events', 'utils'], function ( mediator, events, utils ) {

  describe("Mediator", function () {

    describe("Given the events are registered in a functional, API style", function () {

      var data = { 
        page: 1, 
        totalResults: 1000 
      };

      describe("Given a 'event:target' is registered on a target object to 'event:source' on a source object", function () {  

        var source, target;

        beforeEach(function () {

          source = utils.mixin({ name: 'source' }, events);
          target = utils.mixin({ name: 'target' }, events);          

          // The registration 'API-style'
          mediator.from( source , "event:source" ).to( target, "event:target" );

        });

        describe("When 'event:source' is fired on the source object", function () {

          var spyTargetFire;

          beforeEach(function () {
            spyTargetFire = spyOn( target, "fire" ).andCallThrough();
            source.fire("event:source", data );
          });

          it("Should fired 'event:target' event on the target object", function() {
           expect(spyTargetFire).toHaveBeenCalledWith("event:target", data);
          });

          it("Should ONLY fire the event once", function () {
            expect(spyTargetFire.callCount).toEqual(1);
          });

        });

      });

      describe("Given a 'event:target' is registered on 2 target objects to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {

          source = utils.mixin({ name: 'source' }, events);
          target1 = utils.mixin({ name: 'trget1' }, events);
          target2 = utils.mixin({ name: 'target2' }, events);

          // The registration 'API-style'
          mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target2, "event:target" );

        });

        describe("When 'event:source' is fired on the source object", function () {

          var spyTarget1Fire, spyTarget2Fire;

          beforeEach(function () {

            spyTarget1Fire = spyOn( target1, "fire").andCallThrough();
            spyTarget2Fire = spyOn( target2, "fire").andCallThrough();

            source.fire("event:source", data);

          });

          it("Should fire 'event:target' on the first target object", function() {
            expect(spyTarget1Fire).toHaveBeenCalledWith("event:target", data);
          });

          it("Should ONLY fire the event on the first target ONCE", function () {
            expect(spyTarget1Fire.callCount).toEqual(1);
          });

          it("Should fire 'event:target' on the second target object", function() {
            expect(spyTarget2Fire).toHaveBeenCalledWith("event:target", data);
          });

          it("Should ONLY fire the event on the second target ONCE", function () {
            expect(spyTarget2Fire.callCount).toEqual(1);
          });

        });

      });

      describe("Given a 'event:target' is registered on 2 target objects to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {

          source = utils.mixin({ name: 'source' }, events);
          target1 = utils.mixin({ name: 'target1' }, events);
          target2 = utils.mixin({ name: 'target2' }, events);

          // The registration 'API-style'
          mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target2, "event:target" );
        });

        describe("When 'event:target' on the first object is removed from 'event:source' on the source object", function () {

          beforeEach(function () {

            mediator.remove( target1, "event:target" ).from( source , "event:source" );

          });

          describe("When 'event:source' is fired on the source object", function () {

            var spyTarget1Fire, spyTarget2Fire;

            beforeEach(function () {

              spyTarget1Fire = spyOn( target1, "fire").andCallThrough();
              spyTarget2Fire = spyOn( target2, "fire").andCallThrough();

              source.fire("event:source", data );

            });

            it("Should NOT fire 'event:target' on the first target object", function() {
              expect(spyTarget1Fire).not.toHaveBeenCalledWith("event:target", data);
            });

            it("Should fire 'event:target' on the second target object", function() {
              expect(spyTarget2Fire).toHaveBeenCalledWith("event:target", data);
            });

            it("Should ONLY fire the event on the second target ONCE", function () {
              expect(spyTarget2Fire.callCount).toEqual(1);
            });

          });

        });

      });

      describe("Given a 'event:target' and 'event:other' is registered on 1 target object to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {
          
          source = utils.mixin({ name: 'source' }, events);
          target1 = utils.mixin({ name: 'target1' }, events);

          // The registration 'API-style'
          mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target1, "event:other" );
        
        });

        describe("When target1' is removed from 'event:source' on the source object", function () {

          beforeEach(function () {

            mediator.remove( target1 ).from( source , "event:source" );

          });

          describe("When 'event:source' is fired on the source object", function () {

            var spyTarget1Fire;

            beforeEach(function () {

              spyTarget1Fire = spyOn( target1, "fire").andCallThrough();

              source.fire("event:source", data );

            });

            it("Should NOT fire 'event:target' on the first target object", function() {
              expect(spyTarget1Fire).not.toHaveBeenCalledWith("event:target", data);
            });

            it("Should NOT fire 'event:other' on the first target object", function() {
              expect(spyTarget1Fire).not.toHaveBeenCalledWith("event:other", data);
            });

          });

        });

      });

      describe("Given a 'event:target' and 'event:other' is registered on 1 target object to 'event:source' on a source object", function () {

        var source, target1, target2;

        beforeEach(function () {
          source = utils.mixin({ name: 'source' }, events);
          target1 = utils.mixin({ name: 'target1' }, events);

          // The registration 'API-style'
          mediator.from( source , "event:source" )
            .to( target1, "event:target" )
            .to( target1, "event:other" );

        });

        describe("When 'event:other' is removed from 'event:source' on the source object", function () {

          beforeEach(function () {

            mediator.remove( "event:other" );

          });

          describe("When 'event:source' is fired on the source object", function () {

            var spyTarget1Fire; 

            beforeEach(function () {

              spyTarget1Fire = spyOn( target1, "fire").andCallThrough();

              source.fire("event:source", data );

            });

            it("Should fire 'event:target' on the first target object", function() {
              expect(spyTarget1Fire).toHaveBeenCalledWith("event:target", data);
            });

            it("Should NOT fire 'event:other' on the first target object", function() {
              expect(spyTarget1Fire).not.toHaveBeenCalledWith("event:other", data);
            });

          });

        });

      });

    });

  });

});

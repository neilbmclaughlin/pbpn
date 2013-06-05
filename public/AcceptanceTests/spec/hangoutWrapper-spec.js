describe("A hangout wrapper", function() {

    var 
        hangout,
        fakeGoogleHangout,
        newParticipantsJoinedHandler,
        stateChangedHandler,
        init,
        participantsAddedHandlerSpy,
        participantsRemovedHandlerSpy,
        statusChangedHandlerSpy,
        participantsJoinedHandler,
        participantsLeftHandler,
        statusChangedHandler,
        googleParticipants;

    beforeEach(function() {

        newParticipantsJoinedHandler = function() {};
        stateChangedHandler = function() {};
        
        //Arrange
        participantsAddedHandlerSpy = null;
        participantsRemovedHandlerSpy = null;
        statusChangedHandlerSpy = null;
        init = jasmine.createSpy('init');
        
        participantsJoinedHandler = jasmine.createSpy('participantsJoinedHandler');
        participantsLeftHandler = jasmine.createSpy('participantsLeftHandler');
        statusChangedHandler = jasmine.createSpy('statusChangedHandler');
        
        googleParticipants = getGoogleParticipants('Bob,Fred');
        
        fakeGoogleHangout = {
            isApiReady : jasmine.createSpy('isApiReady').andReturn(true),            
            onParticipantsAdded : { add : jasmine.createSpy('onParticipantsAdded') },
            onParticipantsRemoved : { add : jasmine.createSpy('onParticipantsRemoved') },
            data: {
                onStateChanged : { add : jasmine.createSpy('onStateChanged') },
                setValue:  jasmine.createSpy('setValue'),
                getValue : jasmine.createSpy('getValue').andReturn('listener'),

            },
            getLocalParticipant : jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[0]),
        };
        
        hangout = hangoutWrapper({ hangout: fakeGoogleHangout });
    });

    describe("when participants join", function() {
        
        it("should notify subscribers", function() {
            
            //Arrange
            fakeGoogleHangout.onParticipantsAdded.add = function(f) { participantsAddedHandlerSpy = f; };
            hangout.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);

            //Act
            participantsAddedHandlerSpy({ addedParticipants : googleParticipants });
    
            //Assert
            expect(participantsJoinedHandler.callCount).toEqual(1);
            expect(participantsJoinedHandler.calls[0].args[0][0].getName()).toEqual('Bob');        
            expect(participantsJoinedHandler.calls[0].args[0][1].getName()).toEqual('Fred');        
            
        });            
    });

    describe("when participants leave", function() {
        
        it("should notify subscribers", function() {
            
            //Arrange
            fakeGoogleHangout.onParticipantsRemoved.add = function(f) { participantsRemovedHandlerSpy = f; };
            hangout.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);
            
            //Act
            participantsRemovedHandlerSpy({ removedParticipants : googleParticipants });
    
            //Assert
            expect(participantsLeftHandler.callCount).toEqual(1);
            expect(participantsLeftHandler.calls[0].args[0][0].getName()).toEqual('Bob');        
            expect(participantsLeftHandler.calls[0].args[0][1].getName()).toEqual('Fred');        
            
        });            
    });

    describe("when a participant changes status", function() {

        beforeEach(function() {
            //Arrange
            fakeGoogleHangout.data.onStateChanged.add = function(f) { statusChangedHandlerSpy = f; };
            hangout.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);
    
            //Act
            statusChangedHandlerSpy([ { '2' : 'speaker' } ]); //This is a fake - not sure of the value of these tests            
        });
        
        it("then subscribers should be notified", function() {     
            expect(statusChangedHandler.callCount).toEqual(1);
            expect(statusChangedHandler.calls[0].args[0]).toEqual([ { 2 : 'speaker' }]);        
             
        });
        
        it("then the repository should not be called", function() {     
            expect(statusChangedHandler.callCount).toEqual(1);
            expect(fakeGoogleHangout.data.setValue).not.toHaveBeenCalled();
        });
        
    });

    describe("when a hangout starts", function() {
        
        describe("if the gapi is ready", function() {

            beforeEach(function() {
                hangout.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);
            });
            
            it("then the event handler for handling new participants should be wired in", function() {
                expect(fakeGoogleHangout.onParticipantsAdded.add).toHaveBeenCalled();
            }); 
            it("then the event handler for handling participants leaving should be wired in", function() {
                expect(fakeGoogleHangout.onParticipantsRemoved.add).toHaveBeenCalled();
            }); 
            it("then the event handler for handling changes to participant state should be wired in", function() {
                expect(fakeGoogleHangout.data.onStateChanged.add).toHaveBeenCalled()       
            }); 
            it("then the initialiser has been called", function() {
                expect(init).toHaveBeenCalled();    
            }); 
            
        })

        describe("if the gapi is not ready", function() {

            beforeEach(function() {
                var googleParticipants = getGoogleParticipants('Bob');
                fakeGoogleHangout = {
                    isApiReady : jasmine.createSpy('isApiReady').andReturn(false),
                    onApiReady : { add : jasmine.createSpy('onApiReady.add') } ,                
                    getLocalParticipant : jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[0]),
                };
                hangout = hangoutWrapper({ hangout : fakeGoogleHangout });
                hangout.start(newParticipantsJoinedHandler, stateChangedHandler, init);
            });
            it("then the setup should wait until it is ready", function() {
                expect(fakeGoogleHangout.onApiReady.add).toHaveBeenCalled();       
            });  
        });
    });
    

});

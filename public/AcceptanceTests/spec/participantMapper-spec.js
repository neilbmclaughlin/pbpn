describe("A participant mapper", function() {
    
    var googleParticipants, fakeHangout;
    
    beforeEach(function() {
        googleParticipants = getGoogleParticipants('Bob,Fred');
        fakeHangout = {
            setStatus:  jasmine.createSpy('setStatus'),
            getStatus:  jasmine.createSpy('getStatus').andReturn('listener'),
        };        
    });
    
    it("should be able to map from a google participant to a pbp participant", function() {

        //Arrange
        var mapper = participantMapper(fakeHangout, 1);
        
        //Act
        var participant = mapper(googleParticipants[0]);
        
        //Assert        
        expect(participant.getId()).toEqual('1');
        expect(participant.getName()).toEqual('Bob');
        expect(participant.getStatus()).toEqual('listener');
        expect(fakeHangout.getStatus).toHaveBeenCalledWith('1');
    });

    describe("should set to participant local flag", function() {
        
        it("to true when the participant is local", function() {
            //Arrange    
            var mapper = participantMapper(fakeHangout, 2);
            
            //Act
            var participant = mapper(googleParticipants[1]);
            
            //Assert        
            expect(participant.isLocal()).toEqual(true);
        });
        it("to false when the participant is not local", function() {
            //Arrange
            fakeHangout.getLocalParticipant = jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[1])
    
            var mapper = participantMapper(fakeHangout, 2);
            
            //Act
            var participant = mapper(googleParticipants[0]);
            
            //Assert        
            expect(participant.isLocal()).toEqual(false);
        });

    });

});
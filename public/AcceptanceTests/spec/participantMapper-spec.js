$ = require('jquery');;

helper = require('./park-bench-panel-helper.js');
participant = require('../../javascripts/park-bench-panel.js').participant;
participantMapper = require('../../javascripts/park-bench-panel.js').participantMapper;


describe("A participant mapper", function() {
    
    var googleParticipants, fakeHangout;
    
    beforeEach(function() {
        googleParticipants = helper.getGoogleParticipants('Bob,Fred');
        fakeHangout = {
            setStatus:  jasmine.createSpy('setStatus'),
            getStatus:  jasmine.createSpy('getStatus').andReturn('listener'),
        };        
    });
    
    it("should be able to map from a google participant to a pbp participant", function() {

        //Arrange
        var mapper = participantMapper(fakeHangout, []);
        
        //Act
        var participant = mapper(googleParticipants[0]);
        
        //Assert        
        expect(participant.getId()).toEqual('1');
        expect(participant.getName()).toEqual('Bob');
        expect(participant.getStatus()).toEqual('listener');
        expect(fakeHangout.getStatus).toHaveBeenCalledWith('1');
    });

});
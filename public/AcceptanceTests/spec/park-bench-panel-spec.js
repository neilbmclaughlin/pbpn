describe("A Park Bench Panel", function() {

    var fakeRenderer, fakeHangout, pbp;

    var getAddValidator = function(name, status) {
        return function(c, i) {
            return c.args[0] == name && c.args[1] == status;
        };
    };

    beforeEach(function() {

        fakeHangout = jasmine.createSpyObj('repo', ['statusChangedEventHandler', 'getLocalParticipant', 'getParticipants', 'getStatus', 'setStatus', 'clearStatus']);
        fakeRenderer = jasmine.createSpyObj('renderer', ['statusChangedEventHandler', 'add', 'move', 'remove']);
    });

    describe("when initialising the park bench panel", function() {

        var participants = [], localParticipantId = 2;

        beforeEach(function() {

            participants = getPbpParticipants({
                namelist: 'Bob,Fred,Bill',
                status: 'listener',
                localParticipantId: localParticipantId,
                localParticipantStatus: undefined,
                fakeRepository: fakeHangout
            });

            fakeHangout.getStatus.andReturn('listener'); 
            fakeHangout.getParticipants.andReturn(participants);
            fakeHangout.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

            pbp = parkBenchPanel(fakeHangout, fakeRenderer);

            fakeRenderer.statusChangedEventHandler.reset();

            //Act
            pbp.init();

        });

        it("any pre-existing saved status for the local participant should be cleared", function(){
            expect(fakeHangout.clearStatus.callCount).toEqual(1);
            expect(fakeHangout.clearStatus.calls[0].args[0]).toEqual(localParticipantId.toString());
        });
        it("then status of only the local participant should be initialised to 'listener'", function() {
            expect(fakeHangout.setStatus.callCount).toEqual(1);
            expect(fakeHangout.setStatus.calls[0].args[0]).toEqual(participants[localParticipantId - 1].getId());
            expect(fakeHangout.setStatus.calls[0].args[1]).toEqual('listener');
        });
        it("then the renderer should have been instructed to add other participants", function() {
            expect(fakeRenderer.add.callCount).toEqual(2);
        });
        it("then the renderer should have been instructed move this participant", function() {
            expect(fakeRenderer.statusChangedEventHandler.callCount).toEqual(1);
        });
    });

    describe("when I am a listener and I request to speak", function() {

        describe("given there are currently no speakers", function() {

            var participants = [], localParticipantId = 3;

            beforeEach(function() {

                //Arrange
                participants = getPbpParticipants({
                    namelist: 'Bob,Fred,Bill',
                    status: 'listener',
                    localParticipantId: localParticipantId,
                    localParticipantStatus: 'listener',
                    fakeRepository: fakeHangout

                });

                fakeHangout.getParticipants.andReturn(participants);
                fakeHangout.getLocalParticipant.andReturn(participants[localParticipantId - 1]);


                pbp = parkBenchPanel(fakeHangout, fakeRenderer);
                pbp.init();
                fakeRenderer.statusChangedEventHandler.reset();

                //Act
                pbp.gotSomethingToSay('Bill');
            });

            it("then my status should be set to speaker", function() {
                expect(participants[localParticipantId - 1].getStatus()).toEqual('speaker');
                expect(fakeHangout.setStatus.callCount).toEqual(1);
                expect(fakeHangout.setStatus.calls[0].args[0]).toEqual(participants[localParticipantId - 1].getId());
                expect(fakeHangout.setStatus.calls[0].args[1]).toEqual('speaker');
            });
            it("then the renderer should have been instructed update my status", function() {
                expect(fakeRenderer.statusChangedEventHandler.callCount).toEqual(1);
                expect(fakeRenderer.statusChangedEventHandler).toHaveBeenCalledWith({
                    participant: participants[localParticipantId - 1],
                    lastStatus: 'listener',
                });
            });
        });

        describe("given there are currently 3 speakers and the local participant wants to talk", function() {

            var participants = [], localParticipantId = 4;

            beforeEach(function() {

                //Arrange
                participants = getPbpParticipants({
                    namelist: 'Bob,Fred,Bill,Joe',
                    status: 'speaker',
                    localParticipantId: localParticipantId,
                    localParticipantStatus: 'listener',
                    fakeRepository: fakeHangout
                });

                fakeHangout.getParticipants.andReturn(participants);
                fakeHangout.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

                pbp = parkBenchPanel(fakeHangout, fakeRenderer);
                pbp.init();
                fakeRenderer.statusChangedEventHandler.reset();


                //Act
                pbp.gotSomethingToSay('Joe'); //Todo: use getlocalparticipant rather than pass name in
            });
            it("then the listener status should be set to waiting", function() {
                expect(participants[localParticipantId - 1].getStatus()).toEqual('waiting');
            });
            it("then the renderer should update the display", function() {
                expect(fakeRenderer.statusChangedEventHandler.callCount).toEqual(1);
                expect(fakeRenderer.statusChangedEventHandler).toHaveBeenCalledWith({
                    participant: participants[localParticipantId - 1],
                    lastStatus: 'listener',
                });
            });
        });

    });

    describe("when I am a speaker and I request to stop speaking", function() {

        var participants = [], localParticipantId = 3;

        beforeEach(function() {

            //Arrange
            participants = getPbpParticipants({
                namelist: 'Bob,Fred,Bill',
                status: 'speaker',
                localParticipantId: localParticipantId,
                localParticipantStatus: 'speaker',
                fakeRepository: fakeHangout
            });

            fakeHangout.getParticipants.andReturn(participants);
            fakeHangout.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

            pbp = parkBenchPanel(fakeHangout, fakeRenderer);
            pbp.init();
            fakeRenderer.statusChangedEventHandler.reset();
        });

        it("then my status should be set to listener", function() {
            pbp.doneTalkin('Bill');
            expect(participants[localParticipantId - 1].getStatus()).toEqual('listener');
        });

        describe("given there is a waiting participant", function() {
            beforeEach(function() {
                participants[0].setStatus('waiting');
            });
            it("then the waiting participant becomes a speaker", function() {
                pbp.doneTalkin('Bill');
                expect(participants[0].getStatus()).toEqual('speaker');
            });
        });

    });

    describe("when a new participant joins", function() {

        var currentPbpParticipants, newPbpParticipants, localParticipantId = 2;

        beforeEach(function() {

            //Arrange
            var participants = getPbpParticipants({
                namelist: 'Bob,Fred,Bill',
                status: 'listener',
                localParticipantId: localParticipantId,
                localParticipantStatus: 'listener',
                fakeRepository: fakeHangout
            });
            currentPbpParticipants = participants.slice(0, 2);
            newPbpParticipants = participants.slice(2, 3);

            fakeHangout.getParticipants.andReturn(currentPbpParticipants);
            fakeHangout.getLocalParticipant.andReturn(currentPbpParticipants[localParticipantId - 1]);

            pbp = parkBenchPanel(fakeHangout, fakeRenderer);
            pbp.init();
            fakeHangout.statusChangedEventHandler.reset();
            fakeRenderer.add.reset();

            //Act
            pbp.newParticipantsJoined(newPbpParticipants);
        });
        it("then the new participant is added to the park bench panel", function() {
            expect(pbp.getParticipants().length).toEqual(3);
        });
        it("then the status should be set to listener", function() {
            expect(pbp.getParticipants()[2].getStatus()).toEqual('listener');
        });
        it("then the status in the repository should not be updated", function() {
            expect(fakeHangout.statusChangedEventHandler.callCount).toEqual(0);
        });
        it("then the renderer should notified of a new participant event", function() {
            expect(fakeRenderer.add.callCount).toEqual(1);
            expect(fakeRenderer.add.calls[0].args[0].getName()).toEqual('Bill');
            expect(fakeRenderer.add.calls[0].args[0].getStatus()).toEqual('listener');
        });

    });

    describe("when a participant leaves the hangout", function() {

        var participants, localParticipantId = 3, nonLocalParticipantId = 1;

        beforeEach(function() {

            //Arrange
            participants = getPbpParticipants({
                namelist: 'Bob,Fred,Bill',
                status: 'listener',
                localParticipantId: localParticipantId,
                localParticipantStatus: 'listener',
                fakeRepository: fakeHangout
            });

            fakeHangout.getParticipants.andReturn(participants);
            fakeHangout.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

            pbp = parkBenchPanel(fakeHangout, fakeRenderer);
            pbp.init();
            fakeHangout.statusChangedEventHandler.reset();
            fakeRenderer.statusChangedEventHandler.reset();
            fakeRenderer.add.reset();
            fakeRenderer.remove.reset();
        });
        
        describe("the participant is not the local participant", function() {
            
            beforeEach(function() {
                //Act
                pbp.participantLeaves( [ participants[nonLocalParticipantId - 1] ] );                
            });
            
            it("then the participant is removed from the park bench panel", function() {
                expect(pbp.getParticipants().length).toEqual(2);
            });
            it("then the status in the repository should not be updated", function() {
                expect(fakeHangout.statusChangedEventHandler.callCount).toEqual(0);
            });
            it("then the renderer should notified of a participant left event", function() {
                expect(fakeRenderer.remove.callCount).toEqual(1);
                expect(fakeRenderer.remove.calls[0].args[0].getName()).toEqual('Bob');
                expect(fakeRenderer.remove.calls[0].args[0].getStatus()).toEqual('listener');
            });
        });
                
        describe("the participant is the local participant", function() {
            //Act
            beforeEach(function() {
                //Act
                pbp.participantLeaves( [ participants[localParticipantId - 1] ] );                
            });
            
            it("then the status in the repository should be updated", function() {
                expect(fakeHangout.clearStatus.callCount).toEqual(1);
                expect(fakeHangout.clearStatus.calls[0].args[0]).toEqual(localParticipantId.toString());
            });            
        });

    });
});

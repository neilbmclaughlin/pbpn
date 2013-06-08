$ = require('jquery');

helper = require('./park-bench-panel-helper.js');
participant = require('../../javascripts/park-bench-panel.js').participant;
participantMapper = require('../../javascripts/park-bench-panel.js').participantMapper;
parkBenchPanel = require('../../javascripts/park-bench-panel.js').parkBenchPanel;


describe("A Park Bench Panel", function () {

  var fakeRenderer, fakeHangoutWrapper, pbp;

  beforeEach(function () {

    fakeHangoutWrapper = jasmine.createSpyObj('repo', ['statusChangedEventHandler', 'getLocalParticipant', 'getParticipants', 'getStatus', 'requestSpeakingPlace', 'relinquishSpeakingPlace']);
    fakeRenderer = jasmine.createSpyObj('renderer', ['statusChangedEventHandler', 'add', 'move', 'remove']);
  });


  describe("when initialising the park bench panel", function () {

    var participants = [], localParticipantId = 2;

    beforeEach(function () {

      participants = getPbpParticipants({
        namelist: 'Bob,Fred,Bill',
        status: 'listener',
        localParticipantId: localParticipantId,
        localParticipantStatus: undefined,
        fakeHangoutWrapper: fakeHangoutWrapper
      });

      fakeHangoutWrapper.getStatus.andReturn('listener');
      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);

      fakeRenderer.statusChangedEventHandler.reset();

      //Act
      pbp.init();

    });

    it("participants should be loaded", function () {
      expect(fakeHangoutWrapper.getParticipants.callCount).toEqual(1);
    });
    xit("any pre-existing saved status for the local participant should be cleared", function () {
      expect(fakeHangoutWrapper.removeRequestToSpeak.callCount).toEqual(1);
      expect(fakeHangoutWrapper.removeRequestToSpeak.calls[0].args[0]).toEqual(localParticipantId.toString());
    });
    it("then the renderer should have been instructed to add all participants", function () {
      expect(fakeRenderer.add.callCount).toEqual(3);
    });
  });

  describe("when the speaker list has been modified the status of all participants should be refreshed.", function() {

  });

  describe("when a local participant requests to speak", function () {

    var participants = [], localParticipantId;

    it("then they should be added to the speaker queue", function () {

      //Arrange
      localParticipantId = 3;

      participants = getPbpParticipants({
        namelist: 'Bob,Fred,Bill',
        status: 'listener',
        localParticipantId: localParticipantId,
        localParticipantStatus: 'listener',
        fakeHangoutWrapper: fakeHangoutWrapper

      });

      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);


      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();
      fakeRenderer.statusChangedEventHandler.reset();

      //Act
      participants[localParticipantId - 1].requestSpeakingPlace();

      expect(fakeHangoutWrapper.requestSpeakingPlace.callCount).toEqual(1);
      expect(fakeHangoutWrapper.requestSpeakingPlace.calls[0].args[0]).toEqual(localParticipantId.toString());
    });

    describe("given there are currently no speakers", function () {

      beforeEach(function () {

        //Arrange
        localParticipantId = 3;

        participants = getPbpParticipants({
          namelist: 'Bob,Fred,Bill',
          status: 'listener',
          localParticipantId: localParticipantId,
          localParticipantStatus: 'listener',
          fakeHangoutWrapper: fakeHangoutWrapper

        });

        fakeHangoutWrapper.getParticipants.andReturn(participants);
        fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);


        pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
        pbp.init();
        fakeRenderer.statusChangedEventHandler.reset();

        //Act
        participants[localParticipantId - 1].requestSpeakingPlace();
      });

      it("then I should be placed on the speaker queue", function () {
        expect(participants[localParticipantId - 1].getStatus()).toEqual('speaker');
      });
      it("then my status should be set to speaker", function () {
        expect(participants[localParticipantId - 1].getStatus()).toEqual('speaker');
      });
      it("then the renderer should have been instructed update my status", function () {
        expect(fakeRenderer.statusChangedEventHandler.callCount).toEqual(1);
        expect(fakeRenderer.statusChangedEventHandler).toHaveBeenCalledWith({
          participant: participants[localParticipantId - 1],
          lastStatus: 'listener'
        });
      });
    });

    describe("given there are currently 3 speakers and the local participant wants to talk", function () {

      beforeEach(function () {
        localParticipantId = 4;
        //Arrange
        participants = getPbpParticipants({
          namelist: 'Bob,Fred,Bill,Joe',
          status: 'speaker',
          localParticipantId: localParticipantId,
          localParticipantStatus: 'listener',
          fakeHangoutWrapper: fakeHangoutWrapper
        });

        fakeHangoutWrapper.getParticipants.andReturn(participants);
        fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

        pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
        pbp.init();
        fakeRenderer.statusChangedEventHandler.reset();


        //Act
        pbp.gotSomethingToSay('Joe'); //Todo: use getlocalparticipant rather than pass name in
      });
      it("then the listener status should be set to waiting", function () {
        expect(participants[localParticipantId - 1].getStatus()).toEqual('waiting');
      });
      it("then the renderer should update the display", function () {
        expect(fakeRenderer.statusChangedEventHandler.callCount).toEqual(1);
        expect(fakeRenderer.statusChangedEventHandler).toHaveBeenCalledWith({
          participant: participants[localParticipantId - 1],
          lastStatus: 'listener'
        });
      });
    });

  });

  describe("when I am a speaker and I request to stop speaking", function () {

    var participants = [], localParticipantId = 3;

    beforeEach(function () {

      //Arrange
      participants = getPbpParticipants({
        namelist: 'Bob,Fred,Bill',
        status: 'speaker',
        localParticipantId: localParticipantId,
        localParticipantStatus: 'speaker',
        fakeHangoutWrapper: fakeHangoutWrapper
      });

      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();
      fakeRenderer.statusChangedEventHandler.reset();
    });

    it("then my status should be set to listener", function () {
      pbp.doneTalkin('Bill');
      expect(participants[localParticipantId - 1].getStatus()).toEqual('listener');
    });

    describe("given there is a waiting participant", function () {
      beforeEach(function () {
        participants[0].setStatus('waiting');
      });
      it("then the waiting participant becomes a speaker", function () {
        pbp.doneTalkin('Bill');
        expect(participants[0].getStatus()).toEqual('speaker');
      });
    });

  });

  describe("when a new participant joins", function () {

    var currentPbpParticipants, newPbpParticipants, localParticipantId = 2;

    beforeEach(function () {

      //Arrange
      var participants = getPbpParticipants({
        namelist: 'Bob,Fred,Bill',
        status: 'listener',
        localParticipantId: localParticipantId,
        localParticipantStatus: 'listener',
        fakeHangoutWrapper: fakeHangoutWrapper
      });
      currentPbpParticipants = participants.slice(0, 2);
      newPbpParticipants = participants.slice(2, 3);

      fakeHangoutWrapper.getParticipants.andReturn(currentPbpParticipants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(currentPbpParticipants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();
      fakeHangoutWrapper.statusChangedEventHandler.reset();
      fakeRenderer.add.reset();

      //Act
      pbp.newParticipantsJoined(newPbpParticipants);
    });
    it("then the new participant is added to the park bench panel", function () {
      expect(pbp.getParticipants().length).toEqual(3);
    });
    it("then the status should be set to listener", function () {
      expect(pbp.getParticipants()[2].getStatus()).toEqual('listener');
    });
    it("then the status in the repository should not be updated", function () {
      expect(fakeHangoutWrapper.statusChangedEventHandler.callCount).toEqual(0);
    });
    it("then the renderer should notified of a new participant event", function () {
      expect(fakeRenderer.add.callCount).toEqual(1);
      expect(fakeRenderer.add.calls[0].args[0].getName()).toEqual('Bill');
      expect(fakeRenderer.add.calls[0].args[0].getStatus()).toEqual('listener');
    });

  });

  describe("when a participant leaves the hangout", function () {

    var participants, localParticipantId = 3, nonLocalParticipantId = 1;

    beforeEach(function () {

      //Arrange
      participants = getPbpParticipants({
        namelist: 'Bob,Fred,Bill',
        status: 'listener',
        localParticipantId: localParticipantId,
        localParticipantStatus: 'listener',
        fakeHangoutWrapper: fakeHangoutWrapper
      });

      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();
      fakeHangoutWrapper.statusChangedEventHandler.reset();
      fakeRenderer.statusChangedEventHandler.reset();
      fakeRenderer.add.reset();
      fakeRenderer.remove.reset();
    });

    describe("the participant is not the local participant", function () {

      beforeEach(function () {
        //Act
        pbp.participantLeaves([ participants[nonLocalParticipantId - 1] ]);
      });

      it("then the participant is removed from the park bench panel", function () {
        expect(pbp.getParticipants().length).toEqual(2);
      });
      it("then the status in the repository should not be updated", function () {
        expect(fakeHangoutWrapper.statusChangedEventHandler.callCount).toEqual(0);
      });
      it("then the renderer should notified of a participant left event", function () {
        expect(fakeRenderer.remove.callCount).toEqual(1);
        expect(fakeRenderer.remove.calls[0].args[0].getName()).toEqual('Bob');
        expect(fakeRenderer.remove.calls[0].args[0].getStatus()).toEqual('listener');
      });
    });

    describe("the participant is the local participant", function () {
      //Act
      beforeEach(function () {
        //Act
        pbp.participantLeaves([ participants[localParticipantId - 1] ]);
      });

      it("then the status in the repository should be updated", function () {
        expect(fakeHangoutWrapper.clearStatus.callCount).toEqual(1);
        expect(fakeHangoutWrapper.clearStatus.calls[0].args[0]).toEqual(localParticipantId.toString());
      });
    });

  });
});

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
        nameList: 'Bob,Fred,Bill',
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

  describe("when the speaker list has been modified ", function() {

    var participants = [], localParticipantId = 2;

    beforeEach(function () {

      participants = getPbpParticipants({
        nameList: 'Bob,Fred,Bill',
        status: 'listener',
        localParticipantId: localParticipantId,
        localParticipantStatus: undefined,
        fakeHangoutWrapper: fakeHangoutWrapper
      });

      var stateChangedEvent = {
        metadata : {
          "1" : { key : "1", timestamp : 100 }
        }
      }

      fakeHangoutWrapper.getStatus.andReturn('listener');
      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();

      fakeRenderer.statusChangedEventHandler.reset();

      //Act
      debugger;
      pbp.speakerQueueChangedHandler(stateChangedEvent);

    });

    it("then the status of all participants should be updated", function() {
      expect(participants[0].getStatus()).toEqual('speaker');
      expect(participants[1].getStatus()).toEqual('listener');
      expect(participants[2].getStatus()).toEqual('listener');
    });

  });

  describe("when a new participant joins", function () {

    var currentPbpParticipants, newPbpParticipants, localParticipantId = 2;

    beforeEach(function () {

      //Arrange
      var participants = getPbpParticipants({
        nameList: 'Bob,Fred,Bill',
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
        nameList: 'Bob,Fred,Bill',
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

    it("then they are removed from the participant list", function () {
      //Act
      pbp.participantLeaves([ participants[0] ]);
      expect(pbp.getParticipants().length).toEqual(2);
    });

    it("then the participant has been instructed to leave", function () {
      //Arrange
      participants[0].leave = jasmine.createSpy('dummy');

      //Act
      pbp.participantLeaves([ participants[0] ]);

      expect(participants[0].leave).toHaveBeenCalled();
    });

  });
});
describe("A Park Bench Panel", function () {

  var fakeRenderer, fakeHangoutWrapper, pbp;

  beforeEach(function () {

    fakeHangoutWrapper = jasmine.createSpyObj('hangoutWrapper', ['statusChangedEventHandler', 'getLocalParticipant', 'getParticipants', 'getStatus', 'requestSpeakingPlace', 'relinquishSpeakingPlace', 'mute']);
    fakeRenderer = jasmine.createSpyObj('renderer', ['statusChangedEventHandler', 'joinEventHandler', 'add', 'move', 'remove']);
  });


  describe("when initialising the park bench panel", function () {

    var participants = [], localParticipantId = 2;

    beforeEach(function () {

      participants = helper.getPbpParticipants({
        nameList: 'Bob,Fred,Bill',
        localParticipantId: localParticipantId,
        localParticipantStatus: undefined,
        fakeHangoutWrapper: fakeHangoutWrapper
      });

      fakeHangoutWrapper.getStatus.andReturn('listener');
      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);

      fakeRenderer.statusChangedEventHandler.reset();
      fakeRenderer.joinEventHandler.reset();

      //Act
      pbp.init();

    });

    it("participants should be loaded", function () {
      expect(fakeHangoutWrapper.getParticipants.callCount).toEqual(1);
    });
    it("any pre-existing saved status for the local participant should be cleared", function () {
      expect(fakeHangoutWrapper.relinquishSpeakingPlace.callCount).toEqual(1);
      expect(fakeHangoutWrapper.relinquishSpeakingPlace.calls[0].args[0]).toEqual('2');
    });
    it("the local participant microphone should be muted", function () {
      expect(fakeHangoutWrapper.mute).toHaveBeenCalledWith(true);
    });
    it("then the renderer should have been instructed to add all participants", function () {
      expect(fakeRenderer.joinEventHandler.callCount).toEqual(3);
    });
  });

  describe("when the speaker list has been modified ", function() {

    var participants = [], localParticipantId = 2;

    beforeEach(function () {

      participants = helper.getPbpParticipants({
        nameList: 'Bob,Fred,Bill',
        status: 'listener',
        localParticipantId: localParticipantId,
        localParticipantStatus: undefined,
        fakeHangoutWrapper: fakeHangoutWrapper
      });

      var statuses = ['speaker', 'listener', 'listener'];

      fakeHangoutWrapper.getStatus.andCallFake(function(id) { return statuses[id - 1] });
      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();

      fakeRenderer.statusChangedEventHandler.reset();

      //Act
      debugger;
      pbp.speakerQueueChangedHandler({});

    });

    it("then the status of all participants should be updated", function() {
      expect(participants[0].getStatus()).toEqual('speaker');
      expect(participants[1].getStatus()).toEqual('listener');
      expect(participants[2].getStatus()).toEqual('listener');
    });

  });

  describe("when a new participant joins", function () {

    var currentPbpParticipants, newPbpParticipants, localParticipantId = 2, joinFake;

    beforeEach(function () {

      //Arrange
      joinFake = jasmine.createSpy('joinFake');
      var participants = helper.getPbpParticipants({
        nameList: 'Bob,Fred,Bill',
        fakeHangoutWrapper: fakeHangoutWrapper
      });
      $.each(participants, function(i, p) {p.join = joinFake} );

      currentPbpParticipants = participants.slice(0, 2);
      newPbpParticipants = participants.slice(2, 3);

      fakeHangoutWrapper.getParticipants.andReturn(currentPbpParticipants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(currentPbpParticipants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();
//      fakeHangoutWrapper.statusChangedEventHandler.reset();
//      fakeRenderer.joinEventHandler.reset();
      joinFake.reset();

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
      expect(joinFake.callCount).toEqual(1);
//      expect(fakeRenderer.joinEventHandler.calls[0].args[0].participant.getName()).toEqual('Bill');
//      expect(fakeRenderer.joinEventHandler.calls[0].args[0].participant.getStatus()).toEqual('listener');
    });

  });

  describe("when a participant leaves the hangout", function () {

    var participants, localParticipantId = 3, nonLocalParticipantId = 1, leaveFake;

    beforeEach(function () {

      //Arrange
      leaveFake = jasmine.createSpy('joinFake');

      participants = helper.getPbpParticipants({
        nameList: 'Bob,Fred,Bill',
        status: 'listener',
        fakeHangoutWrapper: fakeHangoutWrapper
      });
      $.each(participants, function(i, p) {p.leave = leaveFake} );


      fakeHangoutWrapper.getParticipants.andReturn(participants);
      fakeHangoutWrapper.getLocalParticipant.andReturn(participants[localParticipantId - 1]);

      pbp = parkBenchPanel(fakeHangoutWrapper, fakeRenderer);
      pbp.init();
      fakeHangoutWrapper.statusChangedEventHandler.reset();
      fakeRenderer.statusChangedEventHandler.reset();
      fakeRenderer.add.reset();
      fakeRenderer.remove.reset();
      leaveFake.reset();
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

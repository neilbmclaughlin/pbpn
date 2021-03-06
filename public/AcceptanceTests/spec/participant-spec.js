describe("A participant", function () {

  it("should be flagged as local or not local", function () {

    //arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getLocalParticipant']);

    var p1 = participant({
      name: 'Bob',
      id: 1,
      chair: fakeHangoutWrapper
    });
    var p2 = participant({
      name: 'Fred',
      id: 2,
      chair: fakeHangoutWrapper
    });
    fakeHangoutWrapper.getLocalParticipant.andReturn(p1);

    //Act

    //Assert
    expect(p1.isLocal()).toBe(true);
    expect(p2.isLocal()).toBe(false);
  });


  it("should notify subscribers of status changes", function () {

    //arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['mute', 'getLocalParticipant']);
    var p1 = participant({
      name: 'Bob',
      id: 1,
      chair: fakeHangoutWrapper
    });
    fakeHangoutWrapper.getLocalParticipant.andReturn(p1);
    var statusChangedHandler1 = jasmine.createSpy('statusChangedHandler1');
    var statusChangedHandler2 = jasmine.createSpy('statusChangedHandler2');
    p1.addOnStatusChangedHandlers([statusChangedHandler1, statusChangedHandler2]);

    //Act
    p1.setStatus('speaker');

    //Assert
    expect(p1.getStatus()).toEqual('speaker');
    expect(statusChangedHandler1).toHaveBeenCalledWith({
      participant: p1,
      lastStatus: 'listener'
    });
    expect(statusChangedHandler2).toHaveBeenCalledWith({
      participant: p1,
      lastStatus: 'listener'
    });
  });

  describe("When a participant changes status", function() {

    var p1, p2, leaveHandler, fakeHangoutWrapper;

    beforeEach(function() {
      //arrange
      fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['mute', 'getLocalParticipant']);

      p1 = participant({
        name: 'Bob',
        id: 1,
        status: 'undefined',
        chair: fakeHangoutWrapper
      });
      p2 = participant({
        name: 'Fred',
        status: 'undefined',
        id: 2,
        chair: fakeHangoutWrapper
      });
      fakeHangoutWrapper.getLocalParticipant.andReturn(p1);


    });

    describe("and the participant is local", function() {

      it("should mute the participant microphone if the participant is a listener", function() {
        p1.setStatus('listener')
        expect(fakeHangoutWrapper.mute).toHaveBeenCalledWith(true);
      });

      it("should mute the participant microphone if the participant is waiting to speak", function() {
        p1.setStatus('waiting')
        expect(fakeHangoutWrapper.mute).toHaveBeenCalledWith(true);
      });

      it("should un-mute the participant microphone if the participant is a speaker", function() {
        p1.setStatus('speaker')
        expect(fakeHangoutWrapper.mute).toHaveBeenCalledWith(false);
      });

    });

    describe("and the participant is not local", function() {

      it("should not set the status of the local participant microphone", function() {
        p2.setStatus('listener')
        expect(fakeHangoutWrapper.mute).not.toHaveBeenCalled();
      });

    });


  });

  describe("when a participant leaves", function() {

    var p1, leaveHandler, fakeHangoutWrapper;
    beforeEach(function() {
      //arrange
      fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['relinquishSpeakingPlace']);
      leaveHandler = jasmine.createSpy('leaveHandler');

      p1 = participant({
        name: 'Bob',
        id: 1,
        chair: fakeHangoutWrapper,
        onLeaveEventHandlers: [ leaveHandler ]
      });

    });

    it("should notify subscribers", function() {
      //Act
      p1.leave();

      //Assert
      expect(leaveHandler).toHaveBeenCalledWith(p1);
    });

    it("if holding a speaking place then it should be relinquished", function() {

      // Note: This functionality will result in a call to relinquish the speaking place for the participant who has left
      // from each hangout client (ie if there are 9 participants using the hangout app and participant 1 is in the
      // speaker queue and leaves then there will be 8 calls to clear the place from the speaker queue. Since it is
      // idempotent this does not matter but is as a consequence of the removed event not being triggered for the
      // participant who leaves before they leave)

      //Arrange
      var p = participant({
        name: 'Bob',
        id: 1,
        status: 'speaker',
        chair: fakeHangoutWrapper
      });
      leaveHandler = jasmine.createSpy('leaveHandler');
      p.addOnLeaveHandlers([leaveHandler]);

      //Act
      p.leave();

      //Assert
      expect(fakeHangoutWrapper.relinquishSpeakingPlace).toHaveBeenCalledWith(1);
    });

    it("if not holding a speaking place then it should not relinquish", function() {

      // Note: This functionality will result in a call to relinquish the speaking place for the participant who has left
      // from each hangout client (ie if there are 9 participants using the hangout app and participant 1 is in the
      // speaker queue and leaves then there will be 8 calls to clear the place from the speaker queue. Since it is
      // idempotent this does not matter but is as a consequence of the removed event not being triggered for the
      // participant who leaves before they leave)

      //Arrange
      var p = participant({
        name: 'Bob',
        id: 1,
        status: 'listener',
        chair: fakeHangoutWrapper
      });
      leaveHandler = jasmine.createSpy('leaveHandler');
      p.addOnLeaveHandlers([leaveHandler]);

      //Act
      p.leave();

      //Assert
      expect(fakeHangoutWrapper.relinquishSpeakingPlace).not.toHaveBeenCalled();
    });

  });


  it("should not notify subscribers if the status is unchanged", function () {
    //arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus']);

    var p1 = participant({
      name: 'Bob',
      id: 1,
      status: 'listener',
      chair: fakeHangoutWrapper
    });
    var statusChangedHandler1 = jasmine.createSpy('statusChangedHandler1');
    p1.addOnStatusChangedHandlers([statusChangedHandler1]);

    //Act
    p1.setStatus('listener');

    //Assert
    expect(p1.getStatus()).toEqual('listener');
    expect(statusChangedHandler1).not.toHaveBeenCalled();
  });

  it("when a request for a speaking place is made it should go through the chair", function () {

    //Arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['requestSpeakingPlace']);

    var p1 = participant({
      name: 'Bob',
      id: 1,
      chair: fakeHangoutWrapper
    });

    //Act
    p1.requestSpeakingPlace();

    //Assert
    expect(fakeHangoutWrapper.requestSpeakingPlace.callCount).toEqual(1);
    expect(fakeHangoutWrapper.requestSpeakingPlace.calls[0].args[0]).toEqual(1);

  });

  it("when a request to relinquish a speaking place is made it should go through the chair", function () {

    //Arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['relinquishSpeakingPlace']);

    var p1 = participant({
      name: 'Bob',
      id: 1,
      chair: fakeHangoutWrapper
    });

    //Act
    p1.relinquishSpeakingPlace();

    //Assert
    expect(fakeHangoutWrapper.relinquishSpeakingPlace.callCount).toEqual(1);
    expect(fakeHangoutWrapper.relinquishSpeakingPlace.calls[0].args[0]).toEqual(1);

  });

});

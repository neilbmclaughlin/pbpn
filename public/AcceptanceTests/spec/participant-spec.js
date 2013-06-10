$ = require('jquery');

participant = require('../../javascripts/park-bench-panel.js').participant;

describe("A participant", function () {

  it("should notify subscribers of status changes", function () {

    //arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus']);
    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({
      name: 'Bob',
      id: 1,
      chair: fakeHangoutWrapper
    });
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

  describe("when a participant leaves", function() {

    var p1, leaveHandler, fakeHangoutWrapper;
    beforeEach(function() {
      //arrange
      fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus', 'relinquishSpeakingPlace']);
      fakeHangoutWrapper.getStatus.andReturn('listener');

      p1 = participant({
        name: 'Bob',
        id: 1,
        chair: fakeHangoutWrapper
      });
      leaveHandler = jasmine.createSpy('leaveHandler');
      p1.addOnLeaveHandlers([leaveHandler]);


    });

    it("should notify subscribers", function() {
      //Act
      p1.leave();

      //Assert
      expect(leaveHandler).toHaveBeenCalledWith(p1);
    });

    it("if local and holding a speaking place then should relinquish it", function() {
      //Arrange
      var p = participant({
        name: 'Bob',
        id: 1,
        local: true,
        chair: fakeHangoutWrapper
      });
      leaveHandler = jasmine.createSpy('leaveHandler');
      p.addOnLeaveHandlers([leaveHandler]);

      fakeHangoutWrapper.getStatus.andReturn('speaker');

      //Act
      p.leave();

      //Assert
      expect(fakeHangoutWrapper.relinquishSpeakingPlace).toHaveBeenCalledWith(1);
    });

    it("if not local and holding a speaking place then should not relinquish it", function() {
      //Arrange
      var p = participant({
        name: 'Bob',
        id: 1,
        local: false,
        chair: fakeHangoutWrapper
      });
      leaveHandler = jasmine.createSpy('leaveHandler');
      p.addOnLeaveHandlers([leaveHandler]);

      fakeHangoutWrapper.getStatus.andReturn('speaker');

      //Act
      p.leave();

      //Assert
      expect(fakeHangoutWrapper.relinquishSpeakingPlace).not.toHaveBeenCalled();
    });


  });


  it("should not notify subscribers if the status is unchanged", function () {
    //arrange
    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus']);
    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({
      name: 'Bob',
      id: 1,
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

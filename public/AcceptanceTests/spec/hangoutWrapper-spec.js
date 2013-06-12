$ = require('jquery');

helper = require('./park-bench-panel-helper.js');
participant = require('../../javascripts/participant.js').participant;
participantMapper = require('../../javascripts/participantMapper.js').participantMapper;
hangoutWrapper = require('../../javascripts/hangoutWrapper.js').hangoutWrapper;


describe("A hangout wrapper", function () {

  var
    wrapper,
    fakeGapi,
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

  beforeEach(function () {

    newParticipantsJoinedHandler = function () {
    };
    stateChangedHandler = function () {
    };

    //Arrange
    participantsAddedHandlerSpy = null;
    participantsRemovedHandlerSpy = null;
    statusChangedHandlerSpy = null;
    init = jasmine.createSpy('init');

    participantsJoinedHandler = jasmine.createSpy('participantsJoinedHandler');
    participantsLeftHandler = jasmine.createSpy('participantsLeftHandler');
    statusChangedHandler = jasmine.createSpy('statusChangedHandler');

    googleParticipants = helper.getGoogleParticipants('Bob,Fred');

    fakeGapi = {
      isApiReady: jasmine.createSpy('isApiReady').andReturn(true),
      onParticipantsAdded: { add: jasmine.createSpy('onParticipantsAdded') },
      onParticipantsRemoved: { add: jasmine.createSpy('onParticipantsRemoved') },
      data: {
        onStateChanged: { add: jasmine.createSpy('onStateChanged') },
        setValue: jasmine.createSpy('setValue'),
        getValue: jasmine.createSpy('getValue').andReturn('listener')

      },
      getLocalParticipant: jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[0])
    };

    wrapper = hangoutWrapper({ hangout: fakeGapi });
  });

  describe("when participants join", function () {

    it("should notify subscribers", function () {

      //Arrange
      fakeGapi.onParticipantsAdded.add = function (f) {
        participantsAddedHandlerSpy = f;
      };
      wrapper.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);

      //Act
      participantsAddedHandlerSpy({ addedParticipants: googleParticipants });

      //Assert
      expect(participantsJoinedHandler.callCount).toEqual(1);
      expect(participantsJoinedHandler.calls[0].args[0][0].getName()).toEqual('Bob');
      expect(participantsJoinedHandler.calls[0].args[0][1].getName()).toEqual('Fred');

    });
  });

  describe("when participants leave", function () {

    it("should notify subscribers", function () {

      //Arrange
      fakeGapi.onParticipantsRemoved.add = function (f) {
        participantsRemovedHandlerSpy = f;
      };
      wrapper.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);

      //Act
      participantsRemovedHandlerSpy({ removedParticipants: googleParticipants });

      //Assert
      expect(participantsLeftHandler.callCount).toEqual(1);
      expect(participantsLeftHandler.calls[0].args[0][0].getName()).toEqual('Bob');
      expect(participantsLeftHandler.calls[0].args[0][1].getName()).toEqual('Fred');

    });
  });

  describe("when the speaker queue changes", function () {

    var speakerQueueChangedHandler = jasmine.createSpy('speakerQueueChangedHandler');
    var speakerQueueChangedHandlerSpy;


    beforeEach(function () {
      //Arrange
      speakerQueueChangedHandler.reset();
      fakeGapi.data.onStateChanged.add = function (f) {
        speakerQueueChangedHandlerSpy = f;
      };
      wrapper.start(participantsJoinedHandler, participantsLeftHandler, speakerQueueChangedHandler, init);

      //Act
      speakerQueueChangedHandlerSpy([
        { '2': 'RequestToSpeak' }
      ]);
    });

    it("then subscribers should be notified", function () {
      expect(speakerQueueChangedHandler.callCount).toEqual(1);
      expect(speakerQueueChangedHandler.calls[0].args[0]).toEqual([
        { 2: 'RequestToSpeak' }
      ]);
    });

  });


  describe("when a hangout starts", function () {

    describe("if the gapi is ready", function () {

      beforeEach(function () {
        wrapper.start(participantsJoinedHandler, participantsLeftHandler, statusChangedHandler, init);
      });

      it("then the event handler for handling new participants should be wired in", function () {
        expect(fakeGapi.onParticipantsAdded.add).toHaveBeenCalledWith(any(Function));
      });
      it("then the event handler for handling participants leaving should be wired in", function () {
        expect(fakeGapi.onParticipantsRemoved.add).toHaveBeenCalledWith(any(Function));
      });
      it("then the event handler for handling changes to participant state should be wired in", function () {
        expect(fakeGapi.data.onStateChanged.add).toHaveBeenCalledWith(statusChangedHandler)
      });
      it("then the initialiser has been called", function () {
        expect(init).toHaveBeenCalled();
      });

    });

    describe("if the gapi is not ready", function () {

      beforeEach(function () {
        var googleParticipants = getGoogleParticipants('Bob');
        fakeGapi = {
          isApiReady: jasmine.createSpy('isApiReady').andReturn(false),
          onApiReady: { add: jasmine.createSpy('onApiReady.add') },
          getLocalParticipant: jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[0])
        };
        wrapper = hangoutWrapper({ hangout: fakeGapi });
        wrapper.start(newParticipantsJoinedHandler, stateChangedHandler, init);
      });
      it("then the setup should wait until it is ready", function () {
        expect(fakeGapi.onApiReady.add).toHaveBeenCalledWith(any(Function));
      });
    });
  });


});

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
    googleParticipants,
    SPEAKER_QUEUE_SIZE = 3;

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
        getValue: jasmine.createSpy('getValue').andReturn('listener'),
        getStateMetadata: jasmine.createSpy('getStateMetadata')

      },
      getLocalParticipant: jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[0])
    };

    wrapper = hangoutWrapper({ hangout: fakeGapi }, SPEAKER_QUEUE_SIZE);
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
        expect(fakeGapi.onParticipantsAdded.add).toHaveBeenCalled();
        expect(typeof(fakeGapi.onParticipantsAdded.add.calls[0].args[0])).toEqual('function')
      });
      it("then the event handler for handling participants leaving should be wired in", function () {
        expect(fakeGapi.onParticipantsRemoved.add).toHaveBeenCalled();
        expect(typeof(fakeGapi.onParticipantsRemoved.add.calls[0].args[0])).toEqual('function')
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
        var googleParticipants = helper.getGoogleParticipants('Bob');
        fakeGapi = {
          isApiReady: jasmine.createSpy('isApiReady').andReturn(false),
          onApiReady: { add: jasmine.createSpy('onApiReady.add') },
          getLocalParticipant: jasmine.createSpy('getLocalParticipant').andReturn(googleParticipants[0])
        };
        wrapper = hangoutWrapper({ hangout: fakeGapi });
        wrapper.start(newParticipantsJoinedHandler, stateChangedHandler, init);
      });
      it("then the setup should wait until it is ready", function () {
        expect(fakeGapi.onApiReady.add).toHaveBeenCalled();
        expect(typeof(fakeGapi.onApiReady.add.calls[0].args[0])).toEqual('function')
      });
    });
  });

  describe("when a participant queries it's status", function(){

    beforeEach(function() {
      //Arrange
      fakeGapi.data.getStateMetadata.andReturn({
        '1' : { key : '1', value : 'RequestToSpeak', timediff : 0, timestamp : 100 },
        '2' : { key : '2', value : 'RequestToSpeak', timediff : 0, timestamp : 300 },
        '3' : { key : '3', value : 'RequestToSpeak', timediff : 0, timestamp : 200 },
        '4' : { key : '4', value : 'RequestToSpeak', timediff : 0, timestamp : 400 }
      });

    });

    describe("and the participant is in the speaker queue (ordered by how long participants have been in the queue with oldest at the top)", function() {

      describe("and the participant is in the top 3 of the queue", function() {

        it("then the participant status should be 'speaker'", function() {

          //Act
          var status = wrapper.getStatus('1');

          //Assert
          expect(status).toEqual('speaker')

        });

      });

      describe("and the participant is outside the top 3 of the queue", function() {

        it("then the participant status should be 'waiting'", function() {

          //Act
          var status = wrapper.getStatus('4');

          //Assert
          expect(status).toEqual('waiting')

        });

      });

    });

    describe("the participant is not in the speaker queue", function() {

      it("then the participant status should be 'waiting'", function() {

        //Act
        var status = wrapper.getStatus('5');

        //Assert
        expect(status).toEqual('listener')

      });

    });


  });


});

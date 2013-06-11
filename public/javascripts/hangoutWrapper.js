this.hangoutWrapper = function(gapi) {

  var that = {};

  var getWrappedHandler = function(f, mapper, propertyName) {
    return function(participantEvent) {
      var pbpParticipants = $.map(participantEvent[propertyName], mapper);
      f(pbpParticipants);
    };
  };

  that.start = function(participantsAddedHandler, participantsLeftHandler, speakerQueueChangedHandler, init) {
    if (gapi.hangout.isApiReady()) {
      setup(participantsAddedHandler, participantsLeftHandler, speakerQueueChangedHandler, init);
    }
    else {
      var f = function() {
        setup(participantsAddedHandler, participantsLeftHandler, speakerQueueChangedHandler, init);
      };
      gapi.hangout.onApiReady.add(f);
    }
  };
  that.getLocalParticipant = function() {
    return participantMapper(gapi.hangout)(gapi.hangout.getLocalParticipant());
  }
  that.getParticipants = function(joinEventHandlers, statusChangedEventHandlers, leaveEventHandlers) {
    var participants = $.map(gapi.hangout.getParticipants(), participantMapper(that));
    $.each(participants, function(i, p) {
      p.addOnJoinHandlers(joinEventHandlers);
      p.addOnStatusChangedHandlers(statusChangedEventHandlers);
      p.addOnLeaveHandlers(leaveEventHandlers);
    });
    return participants;
  };
  that.getStatus = function(participantId) {
    return gapi.hangout.data.getValue(participantId) ? 'speaker' : 'listener';
  };
  that.requestSpeakingPlace = function(participantId) {
    gapi.hangout.data.setValue(participantId, 'RequestToSpeak');
  };
  that.relinquishSpeakingPlace = function(participantId) {
    gapi.hangout.data.clearValue(participantId);
  };

  var setup = function(participantsJoinedHandler, participantsLeftHandler, speakerQueueChangedHandler, init) {
    gapi.hangout.onParticipantsAdded.add(getWrappedHandler(participantsJoinedHandler, participantMapper(that), 'addedParticipants'));
    gapi.hangout.onParticipantsRemoved.add(getWrappedHandler(participantsLeftHandler, participantMapper(that), 'removedParticipants'));
    gapi.hangout.data.onStateChanged.add(speakerQueueChangedHandler);
    init();
  };

  return that;
};
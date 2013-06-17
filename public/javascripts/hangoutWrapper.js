this.hangoutWrapper = function(gapi, speakerQueueSize) {

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
    var mapper = participantMapper(that);
    return mapper(gapi.hangout.getLocalParticipant());
  }
  that.getParticipants = function() {
    return $.map(gapi.hangout.getParticipants(), participantMapper(that));
  };
  that.getStatus = function(participantId) {
    var metadata = gapi.hangout.data.getStateMetadata() || {};

    var orderedSpeakerList = $
      .map(metadata, function(s) {return s })
      .sort(function(s1,s2) { return s1.timestamp - s2.timestamp } )
      .map(function(s) { return s.key });

    var speakerQueuePosition = $.inArray(participantId, orderedSpeakerList) + 1;
    return ( speakerQueuePosition < 1 ? 'listener' : ( speakerQueuePosition <= speakerQueueSize ?  'speaker' : 'waiting') );
  };
  that.requestSpeakingPlace = function(participantId) {
    gapi.hangout.data.setValue(participantId, 'RequestToSpeak');
  };
  that.relinquishSpeakingPlace = function(participantId) {
    gapi.hangout.data.clearValue(participantId);
  };

  that.mute = function(mute) {
    gapi.hangout.av.setMicrophoneMute(mute)
  };

  var setup = function(participantsJoinedHandler, participantsLeftHandler, speakerQueueChangedHandler, init) {
    gapi.hangout.onParticipantsAdded.add(getWrappedHandler(participantsJoinedHandler, participantMapper(that), 'addedParticipants'));
    gapi.hangout.onParticipantsRemoved.add(getWrappedHandler(participantsLeftHandler, participantMapper(that), 'removedParticipants'));
    gapi.hangout.data.onStateChanged.add(speakerQueueChangedHandler);
    init();
  };

  return that;
};
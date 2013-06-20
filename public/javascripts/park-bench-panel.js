this.parkBenchPanel = function(hangoutWrapper, renderer) {

  var participants = null;


  var wireUpParticipant = function(p) {
    p.addOnJoinHandlers([renderer.joinEventHandler]);
    p.addOnStatusChangedHandlers([ renderer.statusChangedEventHandler ]);
    p.addOnLeaveHandlers([renderer.leaveEventHandler]);
    return p;
  }

  var loadParticipants = function() {
    return hangoutWrapper.getParticipants().map(function(p) { return wireUpParticipant(p)});
  };

  return {
    init: function() {
      participants = loadParticipants();
      $.each(participants, function(i, p) { p.join() });
    },
    getParticipants: function() {
      return participants;
    },
    startTalking : function() {
      hangoutWrapper.getLocalParticipant().requestSpeakingPlace();
    },
    stopTalking : function() {
      hangoutWrapper.getLocalParticipant().relinquishSpeakingPlace();
    },
    newParticipantsJoined: function(newParticipants) {
      newParticipants = newParticipants.map(function(p) { return wireUpParticipant(p)});
      $.each(newParticipants, function(i, p) {
        p.join();
        participants.push(p);
      });
    },
    participantLeaves: function(removedParticipants) {
      var removedIds = $.map(removedParticipants, function(p) { return p.getId(); } );
      participants = $.grep(participants, function(p) { return $.inArray(p.getId(), removedIds) < 0 } );
      removedParticipants = removedParticipants.map(function(p) { return wireUpParticipant(p)});
      $.each(removedParticipants, function(i, p) {
        p.leave();
      });
    },
    speakerQueueChangedHandler: function(stateChangedEvent) {
      $.each(participants, function(i, p) {
        var status = hangoutWrapper.getStatus(p.getId());
        p.setStatus(status);
      });
    },
    start: function() {
      hangoutWrapper.start(this.newParticipantsJoined, this.participantLeaves, this.speakerQueueChangedHandler, this.init);
    }
  };
};
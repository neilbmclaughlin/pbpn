this.parkBenchPanel = function(hangoutWrapper, renderer) {

  var participants = null;

  var getParticipantCounts = function() {
    var counts = {
      speaker: 0,
      waiting: 0,
      listener: 0
    };
    $.each(participants, function(i, p) {
      counts[p.getStatus()]++;
    });
    return counts;
  };

  var getParticipantByName = function(name) {
    return $.grep(participants, function(p) {
      return p.getName() == name;
    })[0];
  };

  var getParticipantById = function(id) {
    return $.grep(participants, function(p) {
      return p.getId() == id;
    })[0];
  };

  var getParticipantsByStatus = function(status) {
    return $.grep(participants, function(p) {
      return p.getStatus() == status;
    });
  };

  var getRemoteParticipants = function() {
    return $.grep(participants, function(p) {
      return p.isLocal() === false;
    });
  };

  var setParticipantsStatusChangedEventHandler = function(participants, eventHandlers) {
    $.each(participants, function(i, p) {
      p.addOnStatusChangedHandlers(eventHandlers);
    });
  };

  var displayRemoteParticipants = function(f) {
    $.each(getRemoteParticipants(), function(i, p) {
      f(p);
    });
  };

  var displayParticipants = function(f) {
    $.each(participants, function(i, p) {
      f(p);
    });
  };

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
      var speakerIds = $.map(stateChangedEvent.metadata, function(s) { return s.key } );
      $.each(participants, function(i, p) {
        var status = $.inArray(p.getId(), speakerIds) < 0 ? 'listener' : 'speaker';
        p.setStatus(status);
      });
    },
    start: function() {
      hangoutWrapper.start(this.newParticipantsJoined, this.participantLeaves, this.speakerQueueChangedHandler, this.init);
    }
  };
};
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

  return {
    init: function() {
      participants = hangoutWrapper.getParticipants([renderer.joinEventHandler], [ renderer.statusChangedEventHandler ], [renderer.leaveEventHandler]);
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
      setParticipantsStatusChangedEventHandler(newParticipants, [ renderer.statusChangedEventHandler ] );
      $.each(newParticipants, function(i, p) {
        renderer.add(p);
        participants.push(p);
      });
    },
    participantLeaves: function(removedParticipants) {
      var removedIds = $.map(removedParticipants, function(p) { return p.getId(); } );
      participants = $.grep(participants, function(p) { return $.inArray(p.getId(), removedIds) < 0 } );
      $.each(removedParticipants, function(i, p) {
        p.leave();
        //renderer.remove(p)
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
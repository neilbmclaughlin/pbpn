//if (typeof Object.create !== 'function') {
//  Object.create = function(o) {
//    function F() {}
//    F.prototype = o;
//    return new F();
//  };
//}
//
//Function.prototype.method = function(name, func) {
//  this.prototype[name] = func;
//  return this;
//};
//
//if (!Array.prototype.last) {
//  Array.prototype.last = function() {
//    return this[this.length - 1];
//  };
//}
//
//if (!Array.prototype.first) {
//  Array.prototype.first = function() {
//    return this[0];
//  };
//}

this.participant = function(spec) {

  var that = {};
  var statusChangedEventHandlers = [];
  var status;

  var relinquishSpeakingPlace = function() {
    spec.chair.relinquishSpeakingPlace(spec.id);
  };

  var getStatus = function() {
    if (!status) {
      status = spec.chair.getStatus(spec.id);
    }
    return status;
  };

  if (spec.statusChangedEventHandlers !== undefined) {
    statusChangedEventHandlers.push.apply(statusChangedEventHandlers, spec.statusChangedEventHandlers);
  }

  that.getId = function() {
    return spec.id;
  };

  that.getName = function() {
    return spec.name;
  };

  that.getStatus = getStatus;

  that.isLocal = function() {
    return spec.local;
  };

  that.requestSpeakingPlace = function() {
    spec.chair.requestSpeakingPlace(spec.id);
  }

  that.relinquishSpeakingPlace = relinquishSpeakingPlace

  that.leave = function() {
    if (getStatus() != 'listener') {
      relinquishSpeakingPlace();
    }
  }

  that.setStatus = function(newStatus) {

    if (getStatus() != newStatus) {
      var lastStatus = status;
      status = newStatus;
      $.each(statusChangedEventHandlers, function (i, h) {
        h({
          participant: that,
          lastStatus: lastStatus
        });
      });
    }
  };

  that.addOnStatusChangedHandlers = function(handlers) {
    $.each(handlers, function(i, h) {
      statusChangedEventHandlers.push(h);
    });
  };

  return that;
};

this.participantMapper = function(hangoutWrapper, localParticipantId) {

  return function(googleParticipant) {

//    var repositoryUpdatehandler = function(updateDetails) {
//      hangoutWrapper.setStatus(updateDetails.participant.getId(), updateDetails.participant.getStatus());
//    };

    return participant({
      id: googleParticipant.person.id,
      name: googleParticipant.person.displayName,
      local: googleParticipant.person.id == localParticipantId,
      statusChangedEventHandlers: [],
      chair : hangoutWrapper
    });
  };
};

this.hangoutWrapper = function(gapi) {

  var that = {};
  var localParticipant, mapper;

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
  that.getParticipants = function() {
    return $.map(gapi.hangout.getParticipants(), mapper);
  };
  that.getLocalParticipant = function() {
    //Needed to do this to make dummy pbp work - would prefer to just do it on load.
    var googleLocalParticipant = gapi.hangout.getLocalParticipant();
    mapper = participantMapper(that, googleLocalParticipant.person.id);
    return mapper(googleLocalParticipant);
  };

  that.getStatus = function(participantId) {
    return gapi.hangout.data.getValue(participantId) ? 'speaker' : 'listener';
  };
  that.requestSpeakingPlace = function(participantId, status) {
    gapi.hangout.data.setValue(participantId, 'RequestToSpeak');
  };
  that.relinquishSpeakingPlace = function(participantId) {
    gapi.hangout.data.clearValue(participantId);
  };

  var setup = function(participantsJoinedHandler, participantsLeftHandler, speakerQueueChangedHandler, init) {
    localParticipant = that.getLocalParticipant();
    gapi.hangout.onParticipantsAdded.add(getWrappedHandler(participantsJoinedHandler, mapper, 'addedParticipants'));
    gapi.hangout.onParticipantsRemoved.add(getWrappedHandler(participantsLeftHandler, mapper, 'removedParticipants'));
    gapi.hangout.data.onStateChanged.add(speakerQueueChangedHandler);
    init();
  };

  return that;
};

this.renderer = function() {

  var add = function(participant) {
    var className = ( participant.isLocal() ? 'localParticipant' : '');
    var listName = '#' + participant.getStatus() + 'List';
    $(listName)
      .append($('<li/>')
        .addClass(className)
        .attr('id', participant.getId())
        .fadeIn(500)
        .text(participant.getName()));
  };

  var remove = function(participant, oldStatus) {
    var listName = '#' + ( oldStatus || participant.getStatus() ) + 'List';
    var listItem = $(listName + ' li:contains("' + participant.getName() + '")');
    listItem.slideUp(500, 'linear', function () { $(this).remove();});
  };

  var move = function(participant, oldStatus) {
    remove(participant, oldStatus);
    add(participant);
  };

  return {
    add: add,
    remove: remove,
    move: move,
    statusChangedEventHandler: function(spec) {
      move(spec.participant, spec.lastStatus);
    }
  };
};

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
      participants = hangoutWrapper.getParticipants(); //Todo: pass the renderer event handler to get participants
      setParticipantsStatusChangedEventHandler(participants, [ renderer.statusChangedEventHandler ] );
      displayParticipants(renderer.add);
//      var localParticipant = hangoutWrapper.getLocalParticipant();
//      hangoutWrapper.relinquishSpeakingPlace (localParticipant.getId());
//      localParticipant.setStatus('listener');
    },
    getParticipants: function() {
      return participants;
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
        renderer.remove(p)
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
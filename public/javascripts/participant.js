this.participant = function(spec) {

  var that = {};
  var statusChangedEventHandlers = [];
  var leaveEventHandlers = [];
  var joinEventHandlers = [];
  var status = spec.status || 'listener';

  var relinquishSpeakingPlace = function() {
    spec.chair.relinquishSpeakingPlace(spec.id);
  };

  if (spec.onStatusChangedEventHandlers !== undefined) {
    statusChangedEventHandlers.push.apply(statusChangedEventHandlers, spec.statusChangedEventHandlers);
  }

  if (spec.onJoinEventHandlers !== undefined) {
    joinEventHandlers.push.apply(joinEventHandlers, spec.joinEventHandlers);
  }

  if (spec.onLeaveEventHandlers !== undefined) {
    leaveEventHandlers.push.apply(leaveEventHandlers, spec.onLeaveEventHandlers);
  }

  that.getId = function() {
    return spec.id;
  };

  that.getName = function() {
    return spec.name;
  };

  that.getStatus = function() {
    return status;
  };


  that.setStatus = function(newStatus) {

    if (status != newStatus) {
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

  that.isLocal = function() {
    return spec.chair.getLocalParticipant().getId() == spec.id;
  };

  that.requestSpeakingPlace = function() {
    spec.chair.requestSpeakingPlace(spec.id);
  }

  that.relinquishSpeakingPlace = relinquishSpeakingPlace

  that.leave = function() {
    $.each(leaveEventHandlers, function (i, h) {
      h(that);
    });


    if (that.getStatus() != 'listener') {
      relinquishSpeakingPlace();
    }
  };

  that.join = function() {
    relinquishSpeakingPlace();
    $.each(joinEventHandlers, function (i, h) {
      h(that);
    });
  };

  that.addOnStatusChangedHandlers = function(handlers) {
    $.each(handlers, function(i, h) {
      statusChangedEventHandlers.push(h);
    });
  };

  that.addOnLeaveHandlers = function(handlers) {
    $.each(handlers, function(i, h) {
      leaveEventHandlers.push(h);
    });
  };
  that.addOnJoinHandlers = function(handlers) {
    $.each(handlers, function(i, h) {
      joinEventHandlers.push(h);
    });
  };


  return that;
};
this.participant = function(spec) {

  var that = {};
  var statusChangedEventHandlers = [];
  var leaveEventHandlers = [];
  var joinEventHandlers = [];
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


    if (getStatus() != 'listener') {
      relinquishSpeakingPlace();
    }
  };

  that.join = function() {
    $.each(joinEventHandlers, function (i, h) {
      h({ participant: that });
    });
  };

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
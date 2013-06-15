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
    var listName = '#' + oldStatus + 'List';
    var listItem = $(listName + ' li:contains("' + participant.getName() + '")');
    listItem.slideUp(50, 'linear', function () { $(this).remove();});
  };

  var move = function(participant, oldStatus) {
    remove(participant, oldStatus);
    add(participant);
  };

  return {
    joinEventHandler: function(participant) {
      add(participant);
    },
    statusChangedEventHandler: function(spec) {
      move(spec.participant, spec.lastStatus);
    },
    leaveEventHandler: function(participant) {
      remove(participant, participant.getStatus());
    }
  };
};

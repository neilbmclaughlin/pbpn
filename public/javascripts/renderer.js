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
    joinEventHandler: function(spec) {
      add(spec.participant);
    },
    statusChangedEventHandler: function(spec) {
      move(spec.participant, spec.lastStatus);
    },
    leaveEventHandler: function(spec) {
      remove(spec.participant, spec.lastStatus);
    }
  };
};

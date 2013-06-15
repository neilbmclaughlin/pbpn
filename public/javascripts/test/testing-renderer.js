this.testingRenderer = function(renderer) {

  var that = renderer;

  var super_joinEventHandler = that.joinEventHandler;
  var super_statusChangedEventHandler = that.statusChangedEventHandler;
  var super_leaveEventHandler = that.leaveEventHandler;

  that.joinEventHandler = function(participant) {
    super_joinEventHandler(participant);
    var selectList = $('#localParticipantSelect');
    $('<option/>')
      .text(participant.getName())
      .attr({
        'selected' : participant.isLocal(),
        'value' : participant.getId()
      })
      .appendTo(selectList);
  };

  that.statusChangedEventHandler = function(spec) {
    super_statusChangedEventHandler(spec);
  };


  that.leaveEventHandler = function(participant) {
    super_leaveEventHandler(participant);
    $('#localParticipantSelect option[value=' + participant.getId() + ']').remove();
  };

  return that;
};
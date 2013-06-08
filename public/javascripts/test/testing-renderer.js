var testingRenderer = function() {

  var that = renderer();

  var super_add = that.add;
  var super_remove = that.remove;

  that.add = function(participant) {
    super_add(participant);
    var selectList = $('#localParticipantSelect');
    $('<option/>')
      .text(participant.getName())
      .attr({
        'selected' : participant.isLocal(),
        'value' : participant.getId()
      })
      .appendTo(selectList);
  };

  that.remove = function(participant, oldStatus) {
    super_remove(participant, oldStatus);
    $('#localParticipantSelect option[value=' + participant.getId() + ']').remove();
  };

  that.move = function(participant, oldStatus) {
    that.remove(participant, oldStatus);
    that.add(participant);
  };

  that.statusChangedEventHandler = function(spec) {
    that.move(spec.participant, spec.lastStatus);
  };

  return that;
};
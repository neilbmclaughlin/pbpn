var fakeLocalParticipant;

var getFakeHangout = function() {

  var stateList = {
    1: undefined,
    2 : 'listener',
    3 : 'listener',
    4 : 'listener',
    5 : 'listener'
  };

  var getParticipants = function() {
    return [
      {
        person: {
          id: '1',
          displayName: 'Bob'
        }
      }, {
        person: {
          id: '2',
          displayName: 'Fred'
        }
      }, {
        person: {
          id: '3',
          displayName: 'Bill'
        }
      }, {
        person: {
          id: '4',
          displayName: 'Joe'
        }
      }, {
        person: {
          id: '5',
          displayName: 'Alf'
        }
      }
    ];
  };
  var participantAddedEventHandlerSpy, participantRemovedEventHandlerSpy, stateChangedHandlerSpy;
  var participants;

  fakeLocalParticipant = getParticipants()[0];

  return {
    isApiReady: function() { return true; },
    getParticipants: function() {
      participants = getParticipants();
      return participants;
    },
    onParticipantsAdded: {
      add: function(f) {
        participantAddedEventHandlerSpy = f;
      }
    },
    onParticipantsRemoved: {
      add: function(f) {
        participantRemovedEventHandlerSpy = f;
      }
    },
    data: {
      onStateChanged: {
        add: function(f) {
          stateChangedHandlerSpy = f;
        }
      },
      getValue: function(key) {
        return stateList[key];
      },
      setValue: function(key, value) {
        stateList[key] = value;
      },
      clearValue: function(key) {
        stateList[key] = undefined;
      }
    },
    getLocalParticipant : function() {
      // var localParticipant = jQuery.grep(participants, function(p){
      //     return (p.person.displayName == $('#localParticipantSelect').val() );
      // })[0];
      return fakeLocalParticipant;
    },
    participantSelectChanged : function() {
      fakeLocalParticipant = jQuery.grep(participants, function(p){
        return (p.person.id == $('#localParticipantSelect').val() );
      })[0];
    },
    addTestParticipant : function() {
      var id = participants.length + 1;
      var p = {
        person: {
          id : id,
          displayName : $('#displayName').val()
        }
      };
      participants.push(p);
      participantAddedEventHandlerSpy( { addedParticipants : [p] });
    },
    removeTestParticipant : function() {
      participantRemovedEventHandlerSpy( { removedParticipants : [fakeLocalParticipant] });
      participants = jQuery.grep(participants, function(p){
        return (p.person.id != fakeLocalParticipant.id );
      });
      fakeLocalParticipant = participants[0];
    }
  };
};

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

gapi = { hangout : getFakeHangout() };
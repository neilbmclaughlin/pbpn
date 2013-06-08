var fakeLocalParticipant;

var getFakeGapi = function() {

  var speakerQueue = {};

  var getParticipants = function() {
    return [
      {
        person: {
          id: 1,
          displayName: 'Bob'
        }
      }, {
        person: {
          id: 2,
          displayName: 'Fred'
        }
      }, {
        person: {
          id: 3,
          displayName: 'Bill'
        }
      }, {
        person: {
          id: 4,
          displayName: 'Joe'
        }
      }, {
        person: {
          id: 5,
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
        return speakerQueue[key];
      },
      setValue: function(key, value) {
        speakerQueue[key] = { key : key, value : value, timediff : 0, timestamp : new Date().getTime() };
        stateChangedHandlerSpy( speakerQueue );
      },
      clearValue: function(key) {
        delete speakerQueue[key];
        stateChangedHandlerSpy( speakerQueue );
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
    },
    getSpeakerQueue : function() {
      return speakerQueue;
    }
  };
};

gapi = { hangout : getFakeGapi() };
var fakeLocalParticipant;

var getFakeGapi = function() {

  var speakerQueue = {};

  var getParticipants = function() {
    return [
      {
        person: {
          id: 1,
          displayName: 'Bob'
        },
        mute: true
      }, {
        person: {
          id: 2,
          displayName: 'Fred'
        },
        mute: true
      }, {
        person: {
          id: 3,
          displayName: 'Bill'
        },
        mute: true
      }, {
        person: {
          id: 4,
          displayName: 'Joe'
        },
        mute: true
      }, {
        person: {
          id: 5,
          displayName: 'Alf'
        },
        mute: true
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
      getStateMetadata: function() {
        return speakerQueue ;
      },
      setValue: function(key, value) {
        speakerQueue[key] = { key : key, value : value, timediff : 0, timestamp : new Date().getTime() };
        stateChangedHandlerSpy( { metadata: speakerQueue } );
      },
      clearValue: function(key) {
        delete speakerQueue[key];
        stateChangedHandlerSpy( { metadata: speakerQueue } );
      }
    },
    av: {
      setMicrophoneMute: function(mute) {
        fakeLocalParticipant.mute = mute;
        $('#microphoneMuted').prop('checked', mute);
      }
    },
    getLocalParticipant : function() {
      // var localParticipant = jQuery.grep(participants, function(p){
      //     return (p.person.displayName == $('#localParticipantSelect').val() );
      // })[0];
      return fakeLocalParticipant;
    },
    participantSelectChanged : function() {
      $('#' + fakeLocalParticipant.person.id).removeClass('localParticipant')
      fakeLocalParticipant = jQuery.grep(participants, function(p){
        return (p.person.id == $('#localParticipantSelect').val() );
      })[0];
      $('#microphoneMuted').prop('checked', fakeLocalParticipant.mute);
      $('#' + fakeLocalParticipant.person.id).addClass('localParticipant')
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
      $('#' + fakeLocalParticipant.person.id).addClass('localParticipant')
    },
    getSpeakerQueue : function() {
      return speakerQueue;
    }
  };
};

gapi = { hangout : getFakeGapi() };
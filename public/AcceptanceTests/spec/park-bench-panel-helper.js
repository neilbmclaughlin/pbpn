this.getPbpParticipants = function(spec) {

  return $.map(
    spec.nameList.split(','),
    function(n, i) {
      return participant({
        name: n,
        id: (i + 1).toString(),
        chair: spec.fakeHangoutWrapper,
        onJoinEventHandlers: spec.onJoinEventHandlers,
        onStatusChangedEventHandlers: spec.onStatusChangedEventHandlers,
        onLeaveEventHandlers: spec.onLeaveEventHandlers
      });

    });




//    var mapper = participantMapper(spec.fakeHangoutWrapper);
//
//    var pList = $.map(googleParticipants, mapper);
//
//    $.each(pList, function(i, p) {
//        if (p.getId() != spec.localParticipantId) {
//            p.setStatus(spec.status);
//        }
//    });
//    pList[spec.localParticipantId - 1].setStatus(spec.localParticipantStatus);
//    spec.fakeHangoutWrapper.requestSpeakingPlace.reset();
//    spec.fakeHangoutWrapper.relinquishSpeakingPlace.reset();
//
//    return pList;
};

this.getGoogleParticipants = function(nameList) {
    return $.map(
        nameList.split(','),
        function(n, i) { return { 
            person : { 
                id : (i + 1).toString(), //TODO: decide if we need to use person.id or id
                displayName : n
                }
            };
        });
};

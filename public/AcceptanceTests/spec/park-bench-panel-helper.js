this.getPbpParticipants = function(spec) {
    
    var googleParticipants = getGoogleParticipants(spec.nameList);
    var mapper = participantMapper(spec.fakeHangoutWrapper, spec.localParticipantId);

    var pList = $.map(googleParticipants, mapper);
                        
    $.each(pList, function(i, p) {
        if (p.getId() != spec.localParticipantId) {
            p.setStatus(spec.status);
        }
    });
    pList[spec.localParticipantId - 1].setStatus(spec.localParticipantStatus);
    spec.fakeHangoutWrapper.requestSpeakingPlace.reset();
    spec.fakeHangoutWrapper.relinquishSpeakingPlace.reset();
    
    return pList;
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

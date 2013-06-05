var getPbpParticipants = function(spec) {
    
    var googleParticipants = getGoogleParticipants(spec.namelist);
    var mapper = participantMapper(spec.fakeRepository, spec.localParticipantId);

    var pList = $.map(googleParticipants, mapper);
                        
    $.each(pList, function(i, p) {
        if (p.getId() != spec.localParticipantId) {
            p.setStatus(spec.status);
        }
    });
    pList[spec.localParticipantId - 1].setStatus(spec.localParticipantStatus);
    spec.fakeRepository.setStatus.reset();
    spec.fakeRepository.getStatus.reset();
    
    return pList;
};

var getGoogleParticipants = function(nameList) {
    return $.map(
        nameList.split(','),
        function(n, i) { return { 
            person : { 
                id : (i + 1).toString(), //TODO: decide if we need to use person.id or id
                displayName : n,
                }, 
            };
        });
};

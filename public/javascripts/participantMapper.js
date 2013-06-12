this.participantMapper = function(hangoutWrapper) {

  return function(googleParticipant) {

    return participant({
      id: googleParticipant.person.id,
      name: googleParticipant.person.displayName,
      chair : hangoutWrapper
    });
  };
};

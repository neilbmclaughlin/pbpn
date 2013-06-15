this.helper = {

  getPbpParticipants: function (spec) {

    return $.map(
      spec.nameList.split(','),
      function (n, i) {
        return participant({
          name: n,
          id: (i + 1).toString(),
          chair: spec.fakeHangoutWrapper,
          onJoinEventHandlers: spec.onJoinEventHandlers,
          onStatusChangedEventHandlers: spec.onStatusChangedEventHandlers,
          onLeaveEventHandlers: spec.onLeaveEventHandlers
        });

      });
  },

  getGoogleParticipants: function (nameList) {
    return $.map(
      nameList.split(','),
      function (n, i) {
        return {
          person: {
            id: (i + 1).toString(), //TODO: decide if we need to use person.id or id
            displayName: n
          }
        };
      });
  }


}


var hangout = hangoutWrapper(gapi);
var renderer = testingRenderer();
var pbp = parkBenchPanel(hangout, renderer);

$(document).ready(function() {
  pbp.start();
});

function startTalk() {
  var localParticipantName = hangout.getLocalParticipant().getName();
  pbp.gotSomethingToSay(localParticipantName);
}

function stopTalk() {
  var localParticipantName = hangout.getLocalParticipant().getName();
  pbp.doneTalkin(localParticipantName);
}
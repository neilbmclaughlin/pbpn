var hangout = hangoutWrapper(gapi);
var renderer = testingRenderer();
var pbp = parkBenchPanel(hangout, renderer);

$(document).ready(function() {
  pbp.start();
});

function startTalk() {
  var localParticipant = hangout.getLocalParticipant();
  localParticipant.requestSpeakingPlace();
}

function stopTalk() {
  var localParticipant = hangout.getLocalParticipant();
  localParticipant.relinquishSpeakingPlace();
}
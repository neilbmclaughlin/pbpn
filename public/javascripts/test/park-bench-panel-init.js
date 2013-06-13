var renderer = testingRenderer();

var hangout = hangoutWrapper(gapi, 3);
var pbp = parkBenchPanel(hangout, renderer);

$(document).ready(function() {
  pbp.start();
});

function startTalk() {
  pbp.startTalking();
}

function stopTalk() {
  pbp.stopTalking();
}
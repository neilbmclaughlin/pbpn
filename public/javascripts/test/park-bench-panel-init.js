var hangout = hangoutWrapper(gapi);
var renderer = testingRenderer();
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
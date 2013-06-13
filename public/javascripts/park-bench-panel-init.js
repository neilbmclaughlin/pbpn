var hangout = hangoutWrapper(gapi, SPEAKER_QUEUE_SIZE);
var pbp = parkBenchPanel(hangout, renderer);

$(document).ready(function() {
  pbp.start();
});
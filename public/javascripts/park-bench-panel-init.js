var hangout = hangoutWrapper(gapi, SPEAKER_QUEUE_SIZE);
var pbp = parkBenchPanel(hangout, renderer);

$(document).ready(function() {
  $("#helpDialog").dialog( {
      autoOpen: false,
      height: 430,
      width: 290,
      modal: true
    });
  $( document ).tooltip();

  pbp.start();
});
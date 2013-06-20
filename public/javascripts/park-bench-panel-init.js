var hangout = hangoutWrapper(gapi, SPEAKER_QUEUE_SIZE);
var pbp = parkBenchPanel(hangout, renderer);

$(document).ready(function() {
  $("#helpDialog").dialog( {
      autoOpen: false,
      height: 430,
      width: 290,
      modal: true,
      position: { my: "top", at: "bottom", of: btnHelp },
      show: {
        effect: "blind",
        duration: 750
      },
      hide: {
        effect: "blind",
        duration: 750
      }
    });
  $( document ).tooltip();

  pbp.start();
});
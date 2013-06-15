$ = require('jquery');

participant = require('../../javascripts/participant.js').participant;
renderer = require('../../javascripts/renderer.js').renderer;

$("<ul id='listenerList'></ul>").appendTo("body");
$("<ul id='waitingList'></ul>").appendTo("body");
$("<ul id='speakerList'></ul>").appendTo("body");

require('../spec/renderer-spec.js');
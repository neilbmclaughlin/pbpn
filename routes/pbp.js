var express = require('express');

var app = express();

function getBaseUrl(req) {
  var protocol = ( 'development' == app.get('env') ? 'http' : 'https' );
  return protocol + "://" + req.get('host') + req.url;
}

function getSpeakerQueueSize() {
  return process.env.SPEAKER_QUEUE_SIZE || 3;
}

exports.pbp = function(req,res,next){
  res.header('Content-Type', 'application/xml');
  return res.render('pbp-xml', {url: getBaseUrl(req), speakerQueueSize: getSpeakerQueueSize() });
};

exports.dummyPbp = function(req,res,next){
  return res.render('pbp-test-page', {url: getBaseUrl(req), speakerQueueSize: getSpeakerQueueSize() } );
};
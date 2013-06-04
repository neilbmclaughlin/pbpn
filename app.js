
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function getBaseUrl(req) {
  var protocol = req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http" ? 'https' : 'http';
  return protocol + "://" + req.get('host') + req.url;
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/pbp', function(req,res,next){
   res.header('Content-Type', 'application/xml');
   return res.render('pbp-xml', {url : getBaseUrl(req) });
});

app.get('/dummy-pbp', function(req,res,next){
  return res.render('pbp-test-page', {url : getBaseUrl(req) });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

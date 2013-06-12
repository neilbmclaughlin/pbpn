park-bench-panel
================

Google hangout park bench panel app

====

Public Links
============

* [Start page](https://plus.google.com/hangouts/_?gid=727799527310)

Developer Links
============

* [Hangouts console](https://code.google.com/apis/console/b/0/#project:727799527310)
* [Test page using fake hangout API](http://damp-tor-3817.herokuapp.com/dummy-pbp)

jasmine Tests
=============

* [Run tests](http://damp-tor-3817.herokuapp.com/AcceptanceTests/SpecRunner.html)

Notes
=====

useful commands:
jasmine-node --autotest public/AcceptanceTests/spec
foreman start -f Procfile.dev (Procfile.dev uses nodemon rather than node)
node --debug-brk node_modules/jasmine-node/lib/jasmine-node/cli.js public/AcceptanceTests/spec + node-inspector for debugging

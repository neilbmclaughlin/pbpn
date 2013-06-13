![park bench panel - a google+ hangout app](https://developers.google.com/+/images/hangouts-logo.png)

Park Bench Panel
================

pbpn - a google+ hangout park bench panel app written using nodejs + express

Public Links
============

<a href="https://plus.google.com/hangouts/_?gid=727799527310" style="text-decoration:none;">
  <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"
    alt="Start a Hangout"
    style="border:0;width:100px;height:24px;"/>
</a>

Developer Links
============

* [Hangouts console](https://code.google.com/apis/console/b/0/#project:727799527310)
* [Test page using fake hangout API](http://damp-tor-3817.herokuapp.com/dummy-pbp)

jasmine Tests
=============

* [Run tests](http://damp-tor-3817.herokuapp.com/AcceptanceTests/SpecRunner.html)

Notes
=====

Useful commands:

* jasmine-node --autotest public/AcceptanceTests/spec
* foreman start -f Procfile.dev (Procfile.dev uses nodemon rather than node)
* node --debug-brk node_modules/jasmine-node/lib/jasmine-node/cli.js public/AcceptanceTests/spec + node-inspector for debugging

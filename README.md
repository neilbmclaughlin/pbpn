![park bench panel - a google+ hangout app](https://developers.google.com/+/images/hangouts-logo.png)

Park Bench Panel
================

pbpn - a google+ hangout park bench panel app written using nodejs + express

###Park Bench Panel Format

A park bench panel is a way of structuring a panel discussion such that the audience can participate.

* At any given point there are three speaking places.
* Only those participants with a speaking place can speak but any participant can request to speak.
* When someone wishes to speak then one of the current speakers needs to give up their speaking place voluntarily.

[Park Bench Panel](http://c2.com/cgi/wiki?ParkBenchPanel),
[Fishbowl](http://c2.com/cgi/wiki?FishBowl)


Public Links
============

In order to participate in a hangout you will need to have a Google account with Google+ enabled. You will also need a microphone and speakers/headset.

### Staging

<a href="https://plus.google.com/hangouts/_?gid=906710246586" style="text-decoration:none;">
  <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"
    alt="Start a Hangout"
    style="border:0;width:100px;height:24px;"/>
</a>

### Production

<a href="https://plus.google.com/hangouts/_?gid=727799527310" style="text-decoration:none;">
  <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"
    alt="Start a Hangout"
    style="border:0;width:100px;height:24px;"/>
</a>

Developer Links
============

* [Hangouts console](https://code.google.com/apis/console/b/0/#project:727799527310)
* Test page using fake hangout API
    * [Staging](http://calm-reaches-6125.herokuapp.com/dummy-pbp)
    * [Production](http://damp-tor-3817.herokuapp.com/dummy-pbp)

jasmine Tests
=============

Run tests

* [Staging](http://calm-reaches-6125.herokuapp.com/AcceptanceTests/SpecRunner.html)
* [Production](http://damp-tor-3817.herokuapp.com/AcceptanceTests/SpecRunner.html)

Notes
=====

Useful commands:

* jasmine-node --autotest public/AcceptanceTests/spec
* foreman start -f Procfile.dev (Procfile.dev uses nodemon rather than node)
* node --debug-brk node_modules/jasmine-node/lib/jasmine-node/cli.js public/AcceptanceTests/spec + node-inspector for debugging

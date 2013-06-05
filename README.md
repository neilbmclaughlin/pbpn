park-bench-panel
================

Google hangout park bench panel app

====

Public Links
============

* [Cloud 9 Project](http://c9.io/neilbmclaughlin/park-bench-panel)
* [Start page](http://c9.io/neilbmclaughlin/park-bench-panel/workspace/start.html)

Developer Links
============

* [Hangouts console](https://code.google.com/apis/console/b/0/#project:727799527310)
* [Hello World App](https://hangoutsapi.talkgadget.google.com/hangouts?authuser=0&gid=857952554289)
* [Test page using fake hangout API](https://c9.io/neilbmclaughlin/park-bench-panel/workspace/Tests/park-bench-panel-dummy.html)

qUnit Tests
===========

* [Run dev tests](http://c9.io/neilbmclaughlin/park-bench-panel/workspace/Tests/park-bench-panel-tests-dev.html)
* [Run int tests](http://c9.io/neilbmclaughlin/park-bench-panel/workspace/Tests/park-bench-panel-tests-int.html)

jasmine Tests
=============

* [Run dev tests](https://c9.io/neilbmclaughlin/park-bench-panel/workspace/AcceptanceTests/SpecRunner.html)

Notes
=====

* Running the script generate.xml will create an xml file suitable for use as a google hangout app definition. This is run from a pre-commit hook (see below).
* Needed to create a symbolic link to pre-comit script (eg ln -s ~/373312/pre-commit.sh .git/hooks/pre-commit) 
* Hangout xml parser seems to need closing tags for html elements (ie `<script></script>` rather than `<script ... />`)
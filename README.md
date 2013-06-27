Park Bench Panel
================

pbpn - a google+ hangout park bench panel app written using nodejs + express

###Park Bench Panel Format

A park bench panel is a way of structuring a panel discussion such that the audience can participate.

* At any given point there are three speaking places and one empty place.
* Only those participants with a speaking place can speak but any participant can request to speak.
* When someone wishes to speak they occupy the empty place. One of the current speakers then needs to give up their speaking place voluntarily.

[Park Bench Panel](http://c2.com/cgi/wiki?ParkBenchPanel),
[Fishbowl](http://c2.com/cgi/wiki?FishBowl)

###Try it out

<a href="https://plus.google.com/hangouts/_?gid=727799527310" style="text-decoration:none;">
  <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"
    alt="Start a Hangout"
    style="border:0;width:100px;height:24px;"/>
</a>

In order to participate in a hangout you will need to have a Google account with Google+ enabled. You will also need a microphone and speakers/headset.

Please feel free to use the hangout app and give me any feedback. In particular I'd like to hear what is the next feature you would like to see. Log feedback/enhancements using [github issues](https://github.com/neilbmclaughlin/pbpn/issues) and the appropriate tag

Developer Links
===============

* [Hangouts console](https://code.google.com/apis/console/b/0/#project:727799527310)
* Dummy page using fake hangout API
    * [Staging](http://calm-reaches-6125.herokuapp.com/dummy-pbp)
    * [Production](http://damp-tor-3817.herokuapp.com/dummy-pbp)

<table>
    <tr>
        <td>Staging</td>
        <td>
          <a href="https://plus.google.com/hangouts/_?gid=906710246586" style="text-decoration:none;">
            <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"
            alt="Start a Hangout" style="border:0;width:100px;height:24px;"/>
          </a>
        </td>
    </tr>
    <tr>
      <td>Production</td>
      <td>
        <a href="https://plus.google.com/hangouts/_?gid=727799527310" style="text-decoration:none;">
          <img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"
          alt="Start a Hangout" style="border:0;width:100px;height:24px;"/>
        </a>
      </td>
</table>

jasmine Tests
=============

* Run tests
    * [Staging](http://calm-reaches-6125.herokuapp.com/AcceptanceTests/SpecRunner.html)
    * [Production](http://damp-tor-3817.herokuapp.com/AcceptanceTests/SpecRunner.html)

NodeUpNorth Presentation
========================

* [Slides](https://docs.google.com/presentation/d/1FQb8rQaRBmAyZL6triQaTikuqaKWJkxxITkmF3Vd8qw/pub?start=false&loop=false&delayms=3000)
* Blog post to follow very soon

Notes
=====

Useful commands:

* jasmine-node public/AcceptanceTests/nodespec --autotest --watch public --verbose
* foreman start -f Procfile.dev (Procfile.dev uses nodemon rather than node)
* node --debug-brk node_modules/jasmine-node/lib/jasmine-node/cli.js public/AcceptanceTests/spec + node-inspector for debugging

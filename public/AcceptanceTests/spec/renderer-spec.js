$ = require('jquery');

participant = require('../../javascripts/park-bench-panel.js').participant;
renderer = require('../../javascripts/park-bench-panel.js').renderer;

$("<ul id='listenerList'></ul>").appendTo("body");
$("<ul id='waitingList'></ul>").appendTo("body");
$("<ul id='speakerList'></ul>").appendTo("body");

document = $.w

describe("A list renderer", function () {

  var r, fakeHangoutWrapper;
  var GetListItems = function (listId) {
    return $('#' + listId + ' li');
  };

  beforeEach(function () {
    $.fx.off = true; //Turn jQuery animations off to prevent timing issues

    r = renderer();
    $("#speakerList").empty();
    $("#waitingList").empty();
    $("#listenerList").empty();

    fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus']);

  });

  it("Can respond to notification of a change of status for a participant", function () {

    fakeHangoutWrapper.getStatus.andReturn('speaker');
    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });
    //act
    r.statusChangedEventHandler({
      participant: p1,
      lastStatus: 'listener'
    });

    //assert
    expect(GetListItems("speakerList").length).toEqual(1);
    expect(GetListItems("speakerList")[0].innerHTML).toEqual("Bob");
    expect(GetListItems("speakerList")[0].className).toEqual("localParticipant");

  });

  describe("Local participant should be identifiable", function () {

    it("Adding participants to a list should identify the local participant", function () {

      fakeHangoutWrapper.getStatus.andReturn('listener');
      var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });
      var p2 = participant({ id: 2, name: 'Fred', chair: fakeHangoutWrapper, local: false });
      //act
      r.add(p1);
      r.add(p2);

      //assert
      expect(GetListItems("listenerList").length).toEqual(2);
      expect(GetListItems("listenerList")[0].innerHTML).toEqual("Bob");
      expect(GetListItems("listenerList")[0].className).toEqual("localParticipant");
      expect(GetListItems("listenerList")[1].innerHTML).toEqual("Fred");
      expect(GetListItems("listenerList")[1].className).toEqual("");

    });

    it("Moving participants between lists should preserve the identification of the local participant", function () {

      //arange
      fakeHangoutWrapper.getStatus.andReturn('listener');
      var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });
      var p2 = participant({ id: 2, name: 'Fred', chair: fakeHangoutWrapper, local: false });
      r.add(p1);
      r.add(p2);
      p1.setStatus('speaker');

      //act
      r.move(p1, 'listener');

      //assert
      expect(GetListItems("listenerList").length).toEqual(1);
      expect(GetListItems("listenerList")[0].innerHTML).toEqual("Fred");
      expect(GetListItems("listenerList")[0].className).toEqual("");
      expect(GetListItems("speakerList").length).toEqual(1);
      expect(GetListItems("speakerList")[0].innerHTML).toEqual("Bob");
      expect(GetListItems("speakerList")[0].className).toEqual("localParticipant");

    });

  });

  it("New participants will not have a last status and should just be added to the listener list", function () {
    //act
    fakeHangoutWrapper.getStatus.andReturn('listener');
    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });

    r.statusChangedEventHandler({
      participant: p1
    });

    //assert
    expect(GetListItems("listenerList").length).toEqual(1);
    expect(GetListItems("waitingList").length).toEqual(0);
    expect(GetListItems("speakerList").length).toEqual(0);
    expect(GetListItems("listenerList")[0].innerHTML).toEqual("Bob");
  });

  it("Can add multiple entries to a list", function () {

    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });
    var p2 = participant({ id: 1, name: 'Fred', chair: fakeHangoutWrapper, local: false });
    //act
    r.add(p1);
    r.add(p2);

    //assert
    expect(GetListItems("listenerList").length).toEqual(2);
    expect(GetListItems("listenerList")[0].innerHTML).toEqual("Bob");
    expect(GetListItems("listenerList")[1].innerHTML).toEqual("Fred");

  });

  it("Can add an entry to a list", function () {

    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });

    //act
    r.add(p1);

    //assert
    expect(GetListItems("listenerList").length).toEqual(1);
    expect(GetListItems("listenerList")[0].innerHTML).toEqual("Bob");

  });


  it("Can remove an entry from a specified list", function () {

    var fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus']);
    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({
      name: 'Bob',
      id: 1,
      local: true,
      chair: fakeHangoutWrapper
    });

    r.add(p1);


    //act
    r.remove(p1, 'listener');

    //assert
    expect(GetListItems("listenerList").length).toEqual(0);

  });

  it("Can remove an entry from the participants current status list", function () {

    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });
    r.add(p1);


    //act
    r.remove(p1);

    //assert
    expect(GetListItems("listenerList").length).toEqual(0);

  });

  it("Can move a entry between lists", function () {

    //arrange
    fakeHangoutWrapper.getStatus.andReturn('listener');

    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper, local: true });
    r.add(p1);
    p1.setStatus('speaker');

    //act
    r.move(p1, "listener");

    //assert
    expect(GetListItems("listenerList").length).toEqual(0);
    expect(GetListItems("speakerList").length).toEqual(1);

  });

});

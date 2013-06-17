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

    fakeHangoutWrapper = jasmine.createSpyObj('fakeHangoutWrapper', ['getStatus', 'getLocalParticipant', 'mute']);
    fakeHangoutWrapper.getLocalParticipant.andReturn({ getId: function () {
      return 1
    } });


  });

  it("Can respond to notification of a change of status for a participant", function () {

    fakeHangoutWrapper.getStatus.andReturn('speaker');
    var p1 = participant({
      id: 1,
      name: 'Bob',
      status: 'speaker',
      chair: fakeHangoutWrapper
    });
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

  it("Can respond to notification for a participant leaving", function () {

    var p1 = participant({
      id: 1,
      name: 'Bob',
      chair: fakeHangoutWrapper
    });
    r.joinEventHandler(p1);

    //act
    r.leaveEventHandler(p1);

    //assert
    expect(GetListItems("listenerList").length).toEqual(0);
    expect(GetListItems("speakerList").length).toEqual(0);

  });

  it("Can respond to notification for a participant joining", function () {
    //act
    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper });

    r.joinEventHandler(p1);

    //assert
    expect(GetListItems("listenerList").length).toEqual(1);
    expect(GetListItems("waitingList").length).toEqual(0);
    expect(GetListItems("speakerList").length).toEqual(0);
    expect(GetListItems("listenerList")[0].innerHTML).toEqual("Bob");
  });

  it("The local participant in a list should be identifiable.", function () {

    fakeHangoutWrapper.getStatus.andReturn('listener');
    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper });
    var p2 = participant({ id: 2, name: 'Fred', chair: fakeHangoutWrapper });
    //act
    r.joinEventHandler( p1 );
    r.joinEventHandler( p2 );

    //assert
    expect(GetListItems("listenerList").length).toEqual(2);
    expect(GetListItems("listenerList")[0].innerHTML).toEqual("Bob");
    expect(GetListItems("listenerList")[0].className).toEqual("localParticipant");
    expect(GetListItems("listenerList")[1].innerHTML).toEqual("Fred");
    expect(GetListItems("listenerList")[1].className).toEqual("");

  });

  it("After a change in status the local participant in a list should still be identifiable.", function () {

    //arrange
    var p1 = participant({ id: 1, name: 'Bob', chair: fakeHangoutWrapper });
    var p2 = participant({ id: 2, name: 'Fred', chair: fakeHangoutWrapper });

    r.joinEventHandler( p1 );
    r.joinEventHandler( p2 );

    p1.setStatus('speaker')

    //act
    r.statusChangedEventHandler( { participant : p1, lastStatus: 'listener' });

    //assert
    expect(GetListItems("listenerList").length).toEqual(1);
    expect(GetListItems("listenerList")[0].innerHTML).toEqual("Fred");
    expect(GetListItems("listenerList")[0].className).toEqual("");
    expect(GetListItems("speakerList").length).toEqual(1);
    expect(GetListItems("speakerList")[0].innerHTML).toEqual("Bob");
    expect(GetListItems("speakerList")[0].className).toEqual("localParticipant");

  });

});

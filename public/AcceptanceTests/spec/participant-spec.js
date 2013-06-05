describe("A participant", function() {

    it("should notify subscribers of status changes", function() {
        //arrange
        var p1 = participant({
            name: 'Bob',
            id: 1,
            status: 'listener'
        });
        var statusChangedHandler1 = jasmine.createSpy('statusChangedHandler1');
        var statusChangedHandler2 = jasmine.createSpy('statusChangedHandler2');
        p1.addOnStatusChangedHandlers([statusChangedHandler1, statusChangedHandler2]);

        //Act
        p1.setStatus('speaker');

        //Assert
        expect(p1.getStatus()).toEqual('speaker');
        expect(statusChangedHandler1).toHaveBeenCalledWith({
            participant: p1,
            lastStatus: 'listener',
        });
        expect(statusChangedHandler2).toHaveBeenCalledWith({
            participant: p1,
            lastStatus: 'listener',
        });
    });

    it("should not notify subscribers if the status is unchanged", function() {
        //arrange
        var p1 = participant({
            name: 'Bob',
            id: 1,
            status: 'listener'
        });
        var statusChangedHandler1 = jasmine.createSpy('statusChangedHandler1');
        p1.addOnStatusChangedHandlers([statusChangedHandler1]);

        //Act
        p1.setStatus('listener');

        //Assert        
        expect(p1.getStatus()).toEqual('listener');
        expect(statusChangedHandler1).not.toHaveBeenCalled();
    });

});

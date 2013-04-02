describe("appModel", function() {
    var model;
    beforeEach(function() {
        model = new socr.model();
    });

    it("should have a generateTrail function", function() {
        expect(model.generateTrail()).toEqual(false);

    });

    it("should be able to set a dataset", function() {
        var input={
            values:{0: [0,1],
                1 : [2,3]
            },
            keys:{
                0 :['H','T'],
                1 :['T','H']
            },
            type:'processed'
        };
        expect(model.setDataset(input)).toEqual(false);

    });

  describe("should be able to set a dataset", function() {
    beforeEach(function() {
      model.play(song);
      model.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(model.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(model).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      model.resume();
      expect(model.isPlaying).toBeTruthy();
      expect(model.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    model.play(song);
    model.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      model.play(song);

      expect(function() {
        model.resume();
      }).toThrow("song is already playing");
    });
  });
});
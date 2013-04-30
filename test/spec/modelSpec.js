describe("appModel", function() {
    var model;
    beforeEach(function() {
        model = new socr.model();
    });

    it("should have a generateTrail function", function() {
        expect(model.generateTrail).toBeDefined();

    });

    it("should be able to set a data set", function() {
        var input={
            values:[
                  [0,1],
                  [2,3]
            ],
            keys:[
                ['H','T'],
                ['T','H']
            ],
            processed:true
        };
        expect(model.setDataset(input)).toEqual(true);
    });

  describe("generating random samples", function() {
    beforeEach(function() {
        var input = {
            processed:true,
            keys:[
                ["T", "T", "H", "T", "T", "H", "H", "T", "T", "H"],
                ["H","H","H","T","H","T","H","T","T","T"]

            ],
            values:[
                [0,0,1,0,0,1,1,0,0,1],
                [1,1,1,0,1,0,1,0,0,0]
            ]
        };
        model.setDataset(input);
    });

    it("should generate a trail", function() {
      expect(typeof model.generateTrail(1)). toEqual('object');

      // incase of no input given to generateTrail
      //expect(model.generateTrail(null)).toEqual(false);
    });




  });


});
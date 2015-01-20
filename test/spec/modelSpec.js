(function() {
  describe("appModel", function() {
    var model;
    socr.model = new socr.model();
    model = socr.model;
    beforeEach(function() {});
    it("should have a generateTrail function", function() {
      return expect(model.generateTrail).toBeDefined();
    });
    describe("getting and setting Datasets", function() {
      it("should set a dataset from simulations", function() {
        var input;
        input = {
          values: [[0, 1], [2, 3]],
          keys: [["H", "T"], ["T", "H"]],
          processed: true
        };
        return expect(model.setDataset(input)).toEqual(true);
      });
      return it("should set a dataset ignoring undefined,null values", function() {
        var input;
        input = {
          values: [
            {
              cells: [[0], [1], [void 0], [null]],
              id: 1
            }, {
              cells: [[2], [3], [null], [""]],
              id: 2
            }
          ],
          keys: [["H", "T", "H", "H"], ["T", "H", "T", "T"]],
          type: 'spreadsheet'
        };
        expect(model.setDataset(input)).toEqual(true);
        expect(model.getDataset(0)).toEqual([0, 1]);
        return expect(model.getDataset(1)).toEqual([2, 3]);
      });
    });
    describe("generating random samples", function() {
      beforeEach(function() {
        var input;
        input = {
          processed: true,
          keys: [["T", "T", "H", "T", "T", "H", "H", "T", "T", "H"], ["H", "H", "H", "T", "H", "T", "H", "T", "T", "T"]],
          values: [[0, 0, 1, 0, 0, 1, 1, 0, 0, 1], [1, 1, 1, 0, 1, 0, 1, 0, 0, 0]]
        };
        return model.setDataset(input);
      });
      it("should generate a trail", function() {
        return expect(typeof model.generateTrail(1)).toEqual("object");
      });
      return it("should pool the datasets correctly", function() {
        expect(socr.dataStore.sampleSpace).toBeDefined();
        expect(socr.dataStore.sampleSpace.values.getData().length).toEqual(20);
        return expect(socr.dataStore.sampleSpace.values.getData()).toEqual([0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0]);
      });
    });
    return describe("testing calculations", function() {
      beforeEach(function() {
        return socr.dataStore.removeObject("all");
      });
      it("should generate accurate P-value", function() {
        socr.dataStore.createObject("dataset.0.values", [1, 2, 3, 4, 5]);
        socr.dataStore.createObject("dataset.1.values", [4, 5, 6, 7]);
        socr.model.setK();
        return expect(model.getPof("dataset").toFixed(5)).toEqual('0.03833');
      });
      it("should generate accurate DOP", function() {
        socr.dataStore.createObject("dataset.0.values", [1, 1, 1, 0, 1]);
        socr.dataStore.createObject("dataset.1.values", [1, 0, 0, 1, 1, 1, 0, 0, 0]);
        socr.model.setK();
        return expect(model.getDOPof("dataset").toFixed(3)).toEqual('0.099');
      });
      return it("should generate accurate Standard deviation", function() {
        socr.dataStore.createObject("dataset.1.values", [5.94, 6.82, 7.47, 7.48, 8, 8.11, 8.63, 8.69, 8.69, 9.29, 9.44, 9.5]);
        socr.dataStore.createObject("dataset.2.values", [10.14, 10.27, 10.4, 10.47, 10.69, 11.24, 11.47, 11.48, 11.76, 11.76, 12.07, 12.38, 12.43, 12.52, 12.55, 12.56, 12.64, 12.67, 12.78, 12.83, 13.04, 13.07, 13.22, 13.38, 13.58, 14.04, 14.08, 14.11, 14.14, 14.19, 14.22, 14.22, 14.29, 14.32, 14.34, 14.53, 14.71, 15, 15.1, 15.1, 15.25, 15.43, 15.57, 15.63, 15.7, 15.78, 15.98, 16, 16.04, 16.31, 16.32, 16.35, 16.53, 16.53, 16.63, 16.65, 16.75, 16.81, 16.95, 16.96, 17.08, 17.12, 17.14, 17.4, 17.41, 17.45, 17.48, 17.72, 18.38, 18.49, 18.56, 18.64, 18.7, 18.78, 18.93, 18.93, 19.19, 19.47, 19.5, 19.5, 19.65, 19.66, 19.74, 19.79, 19.85]);
        socr.dataStore.createObject("dataset.3.values", [20.11, 20.22, 20.3, 20.38, 20.52, 20.54, 20.75, 20.76, 21.11, 21.19, 21.26, 21.33, 21.39, 21.53, 21.71, 21.86, 22.36, 22.39, 22.65, 22.82, 22.89, 23.07, 23.18, 23.26, 23.35, 23.35, 23.42, 23.42, 23.44, 23.69, 23.74, 23.74, 24.32, 24.42, 24.54, 24.6, 24.86, 25, 25.19, 25.46, 25.65, 25.67, 25.9, 26, 26, 26.14, 26.22, 26.43, 26.75, 26.86, 26.9, 27.18, 27.32, 27.39, 27.97, 28.28, 28.65, 28.79, 28.84, 29.03, 29.08, 29.5, 29.75, 29.79]);
        expect(model.getStandardDevOfDataset(1).toFixed(5)).toEqual('1.04812');
        expect(model.getStandardDevOfDataset(2).toFixed(5)).toEqual('2.69046');
        return expect(model.getStandardDevOfDataset(3).toFixed(5)).toEqual('2.80058');
      });
    });
  });

}).call(this);

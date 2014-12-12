(function() {
  describe("dataSpec", function() {
    var dataStore;
    dataStore = null;
    beforeEach(function() {
      return dataStore = socr.dataStore;
    });
    it("should create a dataObject", function() {
      dataStore.createObject("name", "socr");
      expect(dataStore.name).toBeDefined();
      return expect(typeof dataStore.name).toEqual("object");
    });
    return it("should append data to existing data entry", function() {
      dataStore.createObject("test", [1, 2, 3, 4]);
      expect(dataStore.test).toBeDefined();
      dataStore.createObject("test", [1, 2, 4, 5, 6]);
      expect(dataStore.test).toBeDefined();
      expect(dataStore.test.getData(1)).toEqual(2);
      expect(dataStore.test.getData(3)).toEqual(5);
      expect(dataStore.test.getData(4)).toEqual(6);
      return expect(dataStore.test.getData().length).toEqual(5);
    });
  });

}).call(this);

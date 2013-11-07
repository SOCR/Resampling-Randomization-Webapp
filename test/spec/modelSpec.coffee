describe "appModel", ->
  socr.model = new socr.model()
  model = socr.model
  beforeEach ->

  it "should have a generateTrail function", ->
    expect(model.generateTrail).toBeDefined()

  it "should be able to set a data set", ->
    input =
      values: [[0, 1], [2, 3]]
      keys: [["H", "T"], ["T", "H"]]
      processed: true

    expect(model.setDataset(input)).toEqual true

  describe "generating random samples", ->
    beforeEach ->
      input =
        processed: true
        keys: [["T", "T", "H", "T", "T", "H", "H", "T", "T", "H"], ["H", "H", "H", "T", "H", "T", "H", "T", "T", "T"]]
        values: [[0, 0, 1, 0, 0, 1, 1, 0, 0, 1], [1, 1, 1, 0, 1, 0, 1, 0, 0, 0]]

      model.setDataset input

    it "should generate a trail", ->
      expect(typeof model.generateTrail(1)).toEqual "object"


  describe "testing calculations", ->
    beforeEach ->
      socr.dataStore.removeObject "all"

    #test for P-Value
    it "should generate accurate P-value", ->
      socr.dataStore.createObject "dataset.1.values", [1,2,3,4,5]

      socr.dataStore.createObject "dataset.2.values", [4,5,6,7]

      expect(model.getPof "dataset").toEqual 0.03745653509411884

    #test for DOP
    it "should generate accurate DOP", ->
      socr.dataStore.createObject "dataset.1.values", [1,1,1,0,1]

      socr.dataStore.createObject "dataset.2.values", [1,0,0,1,1,1,0,0,0]

      expect(model.getDOPof("dataset").toFixed(3)).toEqual '0.099'


# incase of no input given to generateTrail
#expect(model.generateTrail(null)).toEqual(false);
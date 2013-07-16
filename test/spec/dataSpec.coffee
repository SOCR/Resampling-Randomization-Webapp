describe "dataSpec", ->
  dataStore = null
  beforeEach ->
    dataStore = socr.dataStore

  it "should create a dataObject", ->
    dataStore.createObject "name", "socr"
    expect(dataStore.name).toBeDefined()
    expect(typeof (dataStore.name)).toEqual "object"

  it "should append data to existing data entry", ->
    dataStore.createObject "test",
      0: [1, 2]
      1: [3, 4]

    expect(dataStore.test).toBeDefined()
    dataStore.createObject "test",
      2: [1, 2]
      3: [4, 5]

    expect(dataStore.test).toBeDefined()
    expect(dataStore.test.getData(0)).toEqual [1, 2]
    expect(dataStore.test.getData(1)).toEqual [3, 4]
    expect(dataStore.test.getData(2)).toEqual [1, 2]
    expect(dataStore.test.getData(3)).toEqual [4, 5]

  it "should overwrite data to existing index", ->
    dataStore.createObject "test",
      0: [1, 2]
      1: [3, 4]

    expect(dataStore.test).toBeDefined()
    dataStore.createObject "test",
      1: [0, 0]

    expect(dataStore.test).toBeDefined()
    expect(dataStore.test.getData(0)).toEqual [1, 2]
    expect(dataStore.test.getData(1)).toEqual [0, 0]


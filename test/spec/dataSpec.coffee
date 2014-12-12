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
      [1,2,3,4]

    expect(dataStore.test).toBeDefined()
    dataStore.createObject "test",
      [1,2,4,5,6]

    expect(dataStore.test).toBeDefined()
    expect(dataStore.test.getData(1)).toEqual 2
    expect(dataStore.test.getData(3)).toEqual 5
    expect(dataStore.test.getData(4)).toEqual 6
    expect(dataStore.test.getData().length).toEqual 5



describe("dataSpec",function(){
	var dataStore=null;
	beforeEach(function(){
		dataStore = new socr.dataStore();
	});
	it("should create a dataObject",function(){
		dataStore.createObject("name","socr");
		expect(dataStore.name).toBeDefined();
		expect(typeof(dataStore.name.util)).toEqual("object");
	})

	it("should append data to existing data entry",function(){
		dataStore.createObject("dataset",{0:[1,2],1:[3,4]});
		expect(dataStore.dataset).toBeDefined();
		dataStore.createObject("dataset",{2:[1,2],3:[4,5]});
		expect(dataStore.dataset).toBeDefined();

		expect(dataStore.dataset.util.getData(0)).toEqual([1,2]);
		expect(dataStore.dataset.util.getData(1)).toEqual([3,4]);
		expect(dataStore.dataset.util.getData(2)).toEqual([1,2]);
		expect(dataStore.dataset.util.getData(3)).toEqual([4,5]);
	})

	it("should overwrite data to existing index",function(){
		dataStore.createObject("dataset",{0:[1,2],1:[3,4]});
		expect(dataStore.dataset).toBeDefined();
		dataStore.createObject("dataset",{1:[0,0]});
		expect(dataStore.dataset).toBeDefined();

		expect(dataStore.dataset.util.getData(0)).toEqual([1,2]);
		expect(dataStore.dataset.util.getData(1)).toEqual([0,0]);
	})

});

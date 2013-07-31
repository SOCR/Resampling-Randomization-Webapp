socr.input.worldbank = function(){

	var indicators = [ 'SP.DYN.CBRT.IN?page=6' , 'SP.DYN.CDRT.IN' , 'SH.XPD.TOTL.ZS' , 'SP.DYN.LE00.IN' , 'SP.POP.TOTL' , 'SL.TLF.TOTL.IN' , 'EN.ATM.CO2E.PC' , 'NY.GDP.MKTP.CD' , 'SP.URB.TOTL' ,'FR.INR.DPST' ];

	/**
	 * Performs the xhr request(s) to worldbank over a selected datasets
	 * Loads data in the excel sheet on successful request
	 * Sample Query http://api.worldbank.org/countries/indicators/SP.DYN.CDRT.IN?format=jsonP&date=2008:2011&per_page=10&prefix=?
	 * @param indicator {string}
	 * @param itemcount {number} - if itemcount is not set, the function is recalled to load all datasets
	 */

	var request = function(indicator, itemcount){

		var requestdata = {
			format : 'jsonP',
			date : '2008:2011',
			per_page  : '1'
		}

		requestdata["per_page"] = (typeof itemcount == 'undefined') ? 1 : itemcount ;
		

		$.ajax({
			url : 'http://api.worldbank.org/countries/indicators/'+indicator+'/?prefix=?',
			dataType : 'json',	
			type : 'GET',
			data : requestdata,
			jsonp : true

		}).done(
			function(res){
				console.log(res)
				var count = res[0].total;
				if(requestdata['per_page'] == 1)
					request(indicator, count);
				else{
					var grid = formatResponse(res);
					socr.dataTable.spreadSheet.loadData(grid);
				}
			}
		)

	}
	/*
	 * formatResponse @private
	 * @params {response} - json response from WorldBank API
	 * @returns [ table ] - To passed on to excel sheet
	 * format - [country, value1, value2, ...]
	 */

	var formatResponse = function(response){

		var yearinterval = 4,
			i = 0,
			table = [];
		
		while( i < response[0].total ){

			var country = response[1][i].country.value,
				row = [];

			row.push(country);

			for(var j = 0 ; j < yearinterval;  j++){
				row.push(response[1][i+j].value);
			}
			table.push(row);
			
			i += yearinterval;
		}

		return table;
	}

}();
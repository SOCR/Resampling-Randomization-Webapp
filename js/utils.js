$.sum = function(arr){
    var sum = 0;
    $.map(arr, function(v){
        sum += parseInt(v);
    });
    return sum;
};

$.mean = function(arr){
    var sum = 0;
    $.map(arr, function(v){
        sum += parseInt(v);
    });
    return sum/arr.length;
};
/*
splits a dot delimited string into an array.
@return: array
*/

$.normalize = function(str){
	if(typeof str === "string"){
		return str.split(".");
	}
	else{
		return false
	}
}
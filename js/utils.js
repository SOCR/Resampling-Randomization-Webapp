$.sum = function(arr){
    var sum = 0;
    $.map(arr, function(v){
        sum += parseInt(v);
    });
    return sum;
};
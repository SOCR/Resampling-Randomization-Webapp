var express = require('express');
var request=require('request');

app = express()

app.use(express.static('./'))

app.get('/socr-dataset',function(req,res,next){
	if(req.query.url){
		request.get(req.query.url, function(err,resp,body){
		  if(err) {
		  }
		  if([200,302,304].indexOf(res.statusCode) != -1 ){
		  	res.json({
		  		data: body,
		  		status: "success"
		  	})
		  } //etc
		  //TODO Do something with response
		});
	} else {
		res.json({
			status: "failure",
			message: "no url param passed."
		})
	}
});

app.listen(8000)
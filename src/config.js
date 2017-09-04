/*
 Mapping between analysis and the inference variable associated with it.
 
 SOCR - Statistical Online Computational Resource
*/

socr.analysis = {
	"Basic":{
		"variables":["Mean","Count"],
		"description":"",
		"disabled":["standardDeviation"],
		start:1,
		end:1
	},
	"Difference-Of-Proportions":{
		"variables":["Difference-Of-Proportions","Mean","Count"],
		"description":"",
		"disabled":["standardDeviation"],
		start:2,
		end:2
	},
	"One-Way-ANOVA":{
		"variables":["P-Value","F-Value","Mean","Count"],
		"description":"",
		"disabled":["standardDeviation"],
		start:2,
		end:10
	}
}

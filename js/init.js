/* 
	init.js
    For standard organisation of different modules and prevention of global namespace clogging   
*/
socr = {}; //The base object

//Three primary objects governing the MVC Architecture

socr.view = {};
socr.model = {};
socr.controller = {};

//Begin the roots of the base
socr.exp = {};
socr.input = {};
socr.vis = {};
socr.tools = {};
socr.dataStore={};

socr.exp.multiK = true; //By defaut allowing only multiK


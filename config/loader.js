'use strict';
const config = require('./config');
const fs = require('fs');

module.exports= function(express,app,mongoose){



const modelPath = config.defaults.root + "/models";
const routerPath = config.defaults.root + "/routes";



fs.readdirSync(modelPath).forEach(function(file) {
    console.log("Loading model : " + file);
    require(modelPath + "/" + file +"/schema.js")(mongoose);
});

fs.readdirSync(routerPath).forEach(function(file) {
    console.log("Loading router : " + file);
    require(routerPath + "/" + file)(express,app,mongoose);
});
}
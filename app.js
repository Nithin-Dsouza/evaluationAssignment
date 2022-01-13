'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require("./config/config.js");
const _ = require("lodash");
const bodyparser = require('body-parser');
app.use(bodyparser.json());


app.all("*", function(req, res, next) {
    var headers = _.clone(req.headers);
    var body = _.clone(req.body);
        console.log(`Request Headers: ${(headers) ? JSON.stringify(headers) : ""}`);
        console.log(`Request Body: ${ (body) ? JSON.stringify(body) : ""}`);
    
    next();
});

require('./config/mongodb');
require('./config/loader')(express,app,mongoose);


app.listen(config.defaults.port,()=>{console.log(`listening at port ${config.defaults.port}.....`)})
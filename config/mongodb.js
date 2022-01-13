'use strict';
const mongoose = require('mongoose');
const config = require("./config");
const url=config.defaults.url;
mongoose.connect(url, {useNewUrlParser:true}).then(() => {
    console.log("Data Base Connected.....");
  }).catch((err)=>console.log(err));
mongoose.connection.on("error", err => {
    console.log(`Data Base Connection Error: ${err.message}`);
  });
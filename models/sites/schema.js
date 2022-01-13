'use strict';
module.exports = function (mongoose){
    const site = new mongoose.Schema ({
        userId:{
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            unique: true ,
            required: true
        },
        socialMedia:{
            type: Object,
        },
        wallet:{
            type: Object,
        },
        bank:{
            type: Object,
        }
    });
    require("./index.js")(site,mongoose);
    return mongoose.model('Sites',site);
    
}
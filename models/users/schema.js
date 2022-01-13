'use strict';
module.exports = function (mongoose){
    const user= new mongoose.Schema ({
        phone:{
            type: Number,
            required: true
        },
        mPin:{
            type: String,
            required: true
        },
        forgotPasswordCount:{
            type: Number,
            default: 0
        }
    });
    require("./index.js")(user,mongoose);
    return mongoose.model('Users',user);
    
}
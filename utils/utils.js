'use strict';
module.exports = function(){

    let vaultUtils = {};
    vaultUtils.sendResponse = async(req,res,httpStatus,data,message,code,token) =>{
        res.status(code).json({
        meta: {
            code: code,
            message: message,
            token: token,
            timestamp: new Date().toISOString()
        },
        data: data });
    }
    return vaultUtils;
}
'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const utils = require('../utils/utils')();
const TOKEN_SECRET=config.defaults.TOKEN_SECRET; 
module.exports = function(){

    let vaultAuth = {};

    vaultAuth.genrateToken = async(data) => {

        return jwt.sign(data,TOKEN_SECRET)

    }

    vaultAuth.verifyToken = async(req,res,next) => {

        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            if(token==null){
             utils.sendResponse(req,res,'unauthorized',{},'Access Denied',401);
             return
            }
            res.data = await jwt.verify(token,TOKEN_SECRET);
            next();
        }catch(err) {
            utils.sendResponse(req,res,'bad request',{},'INVALID TOKEN',400);
        }

    }





    return vaultAuth;
}
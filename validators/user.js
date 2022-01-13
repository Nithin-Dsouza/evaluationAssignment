'use strict';
const Joi = require('joi');
const utils = require('../utils/utils')();

const signupSchema = Joi.object({
  phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({'string.pattern.base':"Phone number must be numbers",'string.length':'phone number length must be 10 characters long'}),
  mPin: Joi.string().length(4).pattern(/^[0-9]+$/).required().messages({'string.pattern.base':"Only numbers are allowed",'string.length':'mPin length must be 4 characters long'}),
  confirmMpin: Joi.string().length(4).valid(Joi.ref('mPin')).messages({'any.only':"Must be same as mPin"})
  });

const loginSchema = Joi.object({
  userName: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({'string.pattern.base':"Phone number must be numbers",'string.length':'phone number length must be 10 characters long'}),
  mPin: Joi.string().length(4).pattern(/^[0-9]+$/).required().messages({'string.pattern.base':"Only numbers are allowed",'string.length':'mPin length must be 4 characters long'})
});

module.exports = function(){
  let vaultValidator = {};

  vaultValidator.signup = async(req,res,next)=>{
    try{
      await signupSchema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      utils.sendResponse(req,res,'bad request',{},error.message,400);
    }
  }

  vaultValidator.login = async(req,res,next)=>{
    try{
      await loginSchema.validateAsync(req.body);
      next();
    } catch (error) {
      utils.sendResponse(req,res,'bad request',{},error.message,400);
    }

  }

  return vaultValidator;
}
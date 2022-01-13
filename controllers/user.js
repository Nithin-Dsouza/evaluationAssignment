'use strict';
const service = require('../services/service')();
const utils = require('../utils/utils')();
const auth = require('../auth/auth')();
const config = require('../config/config');
const fs = require('fs');
const open = require('open');

module.exports = function (mongoose){

    const userSchema = mongoose.model('Users');
    const siteSchema = mongoose.model('Sites');


    let vaultController = {};

    vaultController.signup = async(req,res)=>{
        try {
            const schema = new userSchema();
            schema.phone = req.body.phone;
            let password = req.body.mPin;
            schema.mPin = await service.encryptPassword(password);
           
            await userSchema.addUser(schema);
            utils.sendResponse(req,res,'SUCCESS',user,"Successfully Created Account",200);
            
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        } 
    }

    vaultController.sendOTP = async(req,res) =>{
        try {
            let data = { to: `+91${req.body.phone}`,channel: 'sms'}
            await service.sendOTP(data);
            utils.sendResponse(req,res,'SUCCESS',{},"OTP sent",200);
            
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }

    }

    vaultController.login = async(req,res)=>{
        try {
            const userName = { phone: req.body.userName }
            let user = await userSchema.findUser(userName);
            
            if(await service.decrypt(req.body.mPin, user.mPin))
            {
                const token = await auth.genrateToken(userName);
                utils.sendResponse(req,res,'SUCCESS',user,"Successfully Logged In",200,token);
            }
            else
            {
                throw new Error("Invaild Password");   
            }

            
        } catch (error) {
            utils.sendResponse(req,res,'unauthorized',{},error.message,401);
        }

    }

    vaultController.forgotPassword = async(req,res) => {
        try {
            let data = { to: `+91${req.body.phone}`,channel: 'sms'}
            await service.sendOTP(data);
            const token = await auth.genrateToken({phone: req.body.phone});
            utils.sendResponse(req,res,'SUCCESS',{},"OTP sent",200,token);
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }
    }

    vaultController.resetPassword = async(req,res) => {
        try {
            const data ={ code: req.body.otp,to: `+91${res.data.phone}`};
            await service.verifyOTP(data);
            const updateData = { mPin: await service.encryptPassword(req.body.mPin),forgotPasswordCount:1};
            let user = await userSchema.findUser({phone:res.data.phone});
            if(user.forgotPasswordCount<1){
                await userSchema.updateByField(user,updateData);
                utils.sendResponse(req,res,'Updated',{},"MPin changed sucessfully",201);
            }
            else{
                let sites = await siteSchema.findSite({userId:user._id});
                await siteSchema.deleteData({_id:sites._id});
                utils.sendResponse(req,res,'Forbidden',{},"User data cleared",403);
            }
           
        }catch(error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }
        
    }

    vaultController.homePage = async(req,res) => {
        try {
            let user = await userSchema.findUser(res.data);
            if(user==null)
            throw new Error('Invalid user');
            let data = await siteSchema.findSite({userId:user._id});
            if(data==null)
            data={};
            utils.sendResponse(req,res,'success',data,"Data is displayed",200);

        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }

    }

    vaultController.createSite = async(req,res) => {
        try {
            let sites = await siteSchema.findSite({userId:req.body.userId});
            const logo = await service.findLogo(req.body.url);
            if(sites==null)
            {
                const schema = new siteSchema();
                schema.userId = req.body.userId;
                schema[req.body.folder] = {};
                schema[req.body.folder][req.body.siteName] = {
                    url: req.body.url,
                    userName: req.body.userName,
                    siteName: req.body.siteName,
                    password: req.body.password,
                    notes: req.body.notes,
                    logo: logo
                }
            
                await siteSchema.createSite(schema);
            }
            else
            {
                let newSite = {};
                newSite[req.body.siteName] = {
                    url: req.body.url,
                    userName: req.body.userName,
                    password: req.body.password,
                    notes: req.body.notes,
                    logo: logo
                };
                if(sites[req.body.folder]==null)
                sites[req.body.folder] = {};
                sites[req.body.folder][req.body.siteName] = newSite[req.body.siteName];
            
                await siteSchema.addSite(sites);
            }
            utils.sendResponse(req,res,'SUCCESS',{},"Successfully Added Site",200);
            
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }
    }

    vaultController.search= async(req,res) => {
        try {
            let sites = await siteSchema.findSite({userId:req.body.userId});
            let site = {};
            let searchItem = req.body.searchElement;
            for(let key in sites)
            {   
                if(key==req.body.searchElement)
                {
                    site = await siteSchema.findSpecificSite(sites,req.body.searchElement);
                    utils.sendResponse(req,res,'SUCCESS',site,"Found data",200);
                    return;
                }
            }
            for(let key in sites)
            {
                for(let field in sites[key])
                {
                    searchItem = `${key}.${req.body.searchElement}`;
                    if(field==req.body.searchElement)
                    {
                         site = await siteSchema.findSpecificSite(sites,searchItem);
                        utils.sendResponse(req,res,'SUCCESS',site,"Found data",200);
                        return
                    }
                }
            }
                
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }
    }

    vaultController.updateSite = async(req,res) => {
        try {
            let sites = await siteSchema.findSite({userId:req.body.userId});
            if(sites==null)
            throw new Error('Invalid User');
            const logo = await service.findLogo(req.body.url);
            let update = {};
            update[req.body.siteName] = {
                url: req.body.url,
                userName: req.body.userName,
                password: req.body.password,
                notes: req.body.notes,
                logo: logo
            };
            sites[req.body.folder][req.body.siteName] = update[req.body.siteName];
            
            await siteSchema.addSite(sites);
            utils.sendResponse(req,res,'SUCCESS',{},"Successfully updated ",200);
            
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
            
        }
    }

    vaultController.syncData = async(req,res) => {
        try {
            let user = await userSchema.findUser(res.data);
            let data = await siteSchema.findSite({userId:user._id});
            data = JSON.stringify(data);

            fs.writeFile(config.defaults.root+"/cloud/"+`${user._id}.txt`, data,function (err) {
                if (err) {
                    throw console.log(err);
                    }
                
                console.log("The file was saved!");
                
                });
            utils.sendResponse(req,res,'SUCCESS',{},"Data saved to cloud",200);
            
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }
    }


    vaultController.copy= async(req,res) => {
        try {
            let data = await siteSchema.findSite({userId:req.body.userId});
            if(data==null)
            throw new Error('Invalid data');
            let site = data[req.body.folder][req.body.siteName];
            service.copyPassword(site.password)
            utils.sendResponse(req,res,'SUCCESS',{},"Password copied",200);
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400);
        }
    }

    vaultController.openUrl= async(req,res) => {
        try {
            open(req.body.url);
            utils.sendResponse(req,res,'SUCCESS',{},"Open url in default browser",200);
        } catch (error) {
            utils.sendResponse(req,res,'bad request',{},error.message,400); 
        }
    }

    return vaultController;
}
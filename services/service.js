'use strict';
const config = require('../config/config');
const client = require('twilio')(config.defaults.accountSid,config.defaults.authToken);
const bcrypt = require('bcrypt');
const ncp = require("copy-paste");
const { LogoScrape } = require('logo-scrape');
module.exports = function(){
    let vaultService = {};
    vaultService.encryptPassword = async(password) => {
        try {
            const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password,salt);
            
        } catch (error) {
            throw error;
        }
        
    }

    vaultService.decrypt = async(currentPassword,dbPassword) => {
        try {
            if( await bcrypt.compare(currentPassword, dbPassword))
            return true;
            else
            return false;
        } catch (error) {
            throw error;
        }
    }

    vaultService.sendOTP = async function(data) {
        try {
            await client.verify.services(config.defaults.serviceId)
            .verifications.create({
                channel: data.channel,
                to: data.to
            });
            console.log('OTP sent');
        } catch (error) {
            console.log(error);
            throw error;
        }
    
    }

    vaultService.verifyOTP = async function(data) {
        try {
            await client.verify.services(config.defaults.serviceId)
            .verificationChecks.create({
                code: data.code,
                to: data.to
            });
            console.log('OTP Verified');
        } catch (error) {
            console.log(error);
            throw new Error('Invalid OTP');
        }
    
    }

    vaultService.findLogo = async(url) => {
        try {
            const logo = await LogoScrape.getLogo(url);
            return logo;
        } catch (error) {
            throw error;
            
        }

    }

    vaultService.copyPassword = async(password) => {
        try {
            await ncp.copy(password);
        } catch (error) {
            throw error;
        }
    }

    return vaultService;
}
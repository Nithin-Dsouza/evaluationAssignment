'use strict';
module.exports = function(schema,mongoose){

    schema.statics.createSite = async function(site){
        try {
            await site.save();
    
        } catch (error) {
            throw error;
        }
    }

    schema.statics.addSite = async function(site){
        try {
            await this.findByIdAndUpdate(site.id,site);
        } catch (error) {
            throw error;
        }
    }

    schema.statics.findSite = async function(data){
        try {
            let sites = await this.findOne(data);
            return sites;
            
        } catch (error) {
            throw error;
        }
        
    }

    schema.statics.findSpecificSite = async function(data,searchItem){
        try {
            let site = await this.findOne(data).select(searchItem);
            return site;
        } catch (error) {
            throw error;
        }
        
    }

    schema.statics.deleteData = async function(id){
        try {
            await this.delete(id);
            return
            
        } catch (error) {
            throw error;
        }
        
    }
 
}
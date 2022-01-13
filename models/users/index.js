'use strict';
module.exports = function(schema,mongoose){

    schema.statics.findUser = async function(data){
        try {
            let user = await this.findOne(data);
            if(user===null)
            {
                throw new Error('Invalid username');
            }
            return user;
    
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    schema.statics.addUser = async function(user){
        try {
            await user.save();
        } catch (error) {
            throw error;
        }
    }

    schema.statics.updateByField = async function(user,update){
        try {
            for(let key in update){
                user[key] = update[key];
            }
            await this.findByIdAndUpdate(user.id,user);
            
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    


}
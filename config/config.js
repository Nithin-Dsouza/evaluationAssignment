'use strict';
const defaults = {
    url: 'mongodb://localhost:27017/digitalVault',
    root: require('path').normalize(__dirname+'/..'),
    port: 8081,
    TOKEN_SECRET: 'qwertyuiop',
    serviceId: 'VAf18b88e529f8ca8367e85a18a2f1e8c4',
    accountSid: 'AC54f21c2dee6a1fadd866653f00cc6d67',
    authToken: '5dd9cab7c947ceee297d33a9d2144ce2'
};

module.exports= {defaults};
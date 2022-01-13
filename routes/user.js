'use strict';
module.exports = function(express,app,mongoose){
    const router = express.Router();
    const controller = require("../controllers/user")(mongoose);
    const validator = require("../validators/user")();
    const authenticate = require("../auth/auth")();

    router.post('/signup',validator.signup,controller.signup);
    router.post('/otp',controller.sendOTP);
    router.post('/signin',validator.login,controller.login);
    router.post('/forgot-password',controller.forgotPassword);
    router.post('/reset-password',authenticate.verifyToken,controller.resetPassword);

    app.use('/api/v1/users',router);
}
'use strict';
module.exports = function(express,app,mongoose){
    const router = express.Router();
    const controller = require("../controllers/user")(mongoose);
    const validator = require("../validators/user")();
    const authenticate = require("../auth/auth")();

    
    router.get('/home',authenticate.verifyToken,controller.homePage);
    router.post('/add-site',authenticate.verifyToken,controller.createSite);
    router.post('/sync',authenticate.verifyToken,controller.syncData);
    router.post('/edit',authenticate.verifyToken,controller.updateSite);
    router.post('/copy',authenticate.verifyToken,controller.copy);
    router.post('/open-url',authenticate.verifyToken,controller.openUrl);
    router.post('/search',authenticate.verifyToken,controller.search);

    app.use('/api/v1/sites',router);
}
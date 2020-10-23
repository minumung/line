const { Router } = require('express');
const router = Router();

const controller = require('../controller/maneger.controller');

router.route('/join').post(controller.join);
router.route('/login').post(controller.login);
router.route('/user_info').get(controller.user_info);
router.route('/chk_update').post(controller.chk_update);
router.route('/chk_play').post(controller.chk_play);
module.exports = router;
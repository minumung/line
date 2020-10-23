const { Router } = require('express');
const router = Router();

const controller = require('../controller/member.controller');

router.route('/join').post(controller.join);
router.route('/joinOut').get(controller.joinOut);
router.route('/update').post(controller.update);
router.route('/login').post(controller.login);
router.route('/user_info').get(controller.user_info);
module.exports = router;
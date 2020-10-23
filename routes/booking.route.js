const { Router } = require('express');
const router = Router();

const controller = require('../controller/booking.controller');

router.route('').get(controller.list);
router.route('/maneger').post(controller.maneger_list);
router.route('/create').post(controller.create);
router.route('/delete').post(controller.delete);
module.exports = router;
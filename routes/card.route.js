const { Router } = require('express');
const router = Router();

const controller = require('../controller/card.controller');

router.route('').get(controller.list);
router.route('/create').post(controller.create);
router.route('/delete/:card_key').get(controller.delete);
router.route('/is_payment/:card_key').get(controller.is_payment_update);
module.exports = router;
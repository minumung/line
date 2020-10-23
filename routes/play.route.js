const { Router } = require('express');
const router = Router();

const controller = require('../controller/play.controller');

router.route('').post(controller.list);
router.route('/maneger').post(controller.maneger_list);
router.route('/:play_seq').get(controller.read);
module.exports = router;
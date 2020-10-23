const { Router } = require('express');
const router = Router();

const controller = require('../controller/bookmark.controller');

router.route('').post(controller.list);
router.route('/create').post(controller.create);
module.exports = router;
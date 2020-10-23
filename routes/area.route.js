const { Router } = require('express');
const router = Router();

const controller = require('../controller/area.controller');

router.route('').get(controller.list);
module.exports = router;
const { Router } = require('express');
const router = Router();

const controller = require('../controller/stadium.controller');

router.route('').get(controller.list);
module.exports = router;
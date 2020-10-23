const areaService = require('../service/area.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');
const resData = {};

/**
 * 리스트
 */
exports.list = async (req, res) => {
  const list = await areaService.list(req.body);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};

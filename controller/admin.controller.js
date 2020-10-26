const accountService = require('../service/admin.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');
const resData = {};

/**
 * 리스트
 */
exports.list = async (req, res) => {
  const list = await accountService.list(req.body);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};

/**
 * 상세
 */
exports.read = async (req, res) => {
  const read = await accountService.read(req.params);
  response.success = true;
  
  if(read.length) Object.assign(resData, read[0]);

  response.data = resData;
  return res.status(200).send(response);
};

/**
 * 등록
 */
exports.create = async (req, res) => {
  const record = await accountService.create(req.body);
  
  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};

/**
 * 수정
 */
exports.update = async (req, res) => {
  const record = await accountService.update(req.body);

  if(record[0].changedRows){
    response.success = true;
  }
  return res.status(200).send(response);
};

/**
 * 삭제
 */
exports.delete = async (req, res) => {
  const record = await accountService.delete(req.body);

  if(record[0].changedRows){
    response.success = true;
  }
  return res.status(200).send(response);
};


/**
 * 토큰생성
 */
exports.getToken = async (req, res) => {
  const token = await commonJwt.getToken(req.body);
  response.data = token;
  response.success = true;
  return res.status(200).send(response);
};
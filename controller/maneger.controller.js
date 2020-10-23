const service = require('../service/maneger.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');

/**
 * 매니저 회원가입
 */
exports.join = async (req, res) => {
  const resData = {};
  const record = await service.join(req.body);
  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};


/**
 * 로그인
 */
exports.login = async (req, res) => {
  const resData = {};
  const read = await service.login(req.body);
  
  if(read.length) {
    response.success = true;
    Object.assign(resData, read[0]);
    const token = await commonJwt.getTokenManeger(resData);
    response.data = token;
  }else{
    response.data = null;
  }
  return res.status(200).send(response);
};



/**
 * 매니저 정보
 */
exports.user_info = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

  const read = await service.user_info(token);
  
  
  if(read.length) {
    Object.assign(resData, read[0]);
    response.success = true;
  }
  response.data = resData;
  return res.status(200).send(response);
};


/**
 * 출석체크 변경
 */
exports.chk_update = async (req, res) => {
  const resData = {};
  const record = await service.chk_update(req.body);
  if(record[0].changedRows){
    response.success = true;
  }

  response.data = resData;
  return res.status(200).send(response);
};

/**
 * 출석체크 변경
 */
exports.chk_play = async (req, res) => {
  const resData = {};
  const record = await service.chk_play(req.body);
  if(record[0].changedRows){
    response.success = true;
  }
  
  response.data = resData;
  return res.status(200).send(response);
};
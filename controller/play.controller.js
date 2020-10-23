const service = require('../service/play.service');
const bookmarkService = require('../service/bookmark.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');

/**
 * 매니저입장 매치 리스트
 */
exports.maneger_list = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

  const list = await service.maneger_list(token);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};

/**
 * 매치 리스트
 */
exports.list = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }
  var bookmarkList = null;
  if(token.member_seq){
    bookmarkList= await bookmarkService.list(token);
  }
  const list = await service.list(req.body, bookmarkList);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};

/**
 * 매치 상세
 */
exports.read = async (req, res) => {
  const resData = {};
  const read = await service.read(req.params);
  if(read.length) Object.assign(resData, read[0]);
  response.success = true;
  response.data = resData;
  return res.status(200).send(response);
};

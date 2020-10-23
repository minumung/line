const service = require('../service/bookmark.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');

/**
 * 내 즐겨찾기 경기장 리스트
 */
exports.list = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }
  const list = await service.list(token);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};

/**
 * 즐겨찾는 경기장 추가
 */
exports.create = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  console.log(req.body);
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

  const record = await service.bookmarkAllDelete(token);

  if(record[0].changedRows){
    if(req.body.bookmarkList && req.body.bookmarkList.length){
      const recordCreate = await service.bookmarkAllCreate(token, req.body.bookmarkList);
      if(recordCreate[1]){
        response.success = true;
      }
    }else{
      response.success = true;
    }
  }

  return res.status(200).send(response);
};

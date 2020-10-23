let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");

/**
 * 토큰 생성
 */
exports.getToken = async (param) => {
   /**
   * 토큰의 내용(payload),
   * 비밀키
   * 유효시간
   */
 
  let token = jwt.sign({member_seq: param.member_seq}, secretObj.secret, {expiresIn: '60m'})
  const rstParam = {
    "access_token":token
  }
  return rstParam;
};

/**
 * 토큰 생성 매니저
 */
exports.getTokenManeger = async (param) => {
  /**
  * 토큰의 내용(payload),
  * 비밀키
  * 유효시간
  */

 let token = jwt.sign({maneger_seq: param.maneger_seq}, secretObj.secret, {expiresIn: '60m'})
 const rstParam = {
   "access_token":token
 }
 return rstParam;
};

/**
 * 토큰 체크
 */
exports.tokenCheck = async (token) => {
  const decoded = jwt.verify(token, secretObj.secret, function(err, decoded){
    if(decoded){
      return decoded;
    }else{
      return null;
    }
  });
  return decoded;
};


const service = require('../service/card.service');
const response = require('../infra/vars')
const env_data = require('../infra/env_data')
const commonJwt = require('../common/common_jwt');
const request = require('request-promise-native');

/**
 * 카드등록하기
 */
exports.create = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }


  const card_list = await service.card(token);
  const customer_uid = req.body.card_number+"_"+token.member_seq;

  /**
   * 기존에 등록된 카드인지 체크
   */
  for(var i = 0 ; i < card_list.length ; i++){
    if(card_list[i].card_key == customer_uid){
      response.message = "이미 등록된 카드가 있습니다.";
      return res.status(400).send(response);
    }
  }





  /**
   * 어세스 토큰 가져오기
   */
  const getToken = await request({
    url: 'https://api.iamport.kr/users/getToken',
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    form: {
        imp_key: env_data.impkey,
        imp_secret: env_data.impsecret,
    },
    json: true,
  })

  /**
   * 카드등록하기
   */
  const cardAdd = await request({
    url: 'https://api.iamport.kr/subscribe/customers/'+customer_uid,
    method: 'POST',
    headers: { "Authorization": getToken.response.access_token },
    form: {
        customer_uid: customer_uid,
        card_number: req.body.card_number,
        expiry: req.body.expiry,
        birth: req.body.birth,
        pwd_2digit: req.body.pwd_2digit,
    },
    json: true,
  })
  console.log(cardAdd)


  /**
   * 카드등록 실패시 음수를 리턴함
   */
  if(cardAdd.code != '0'){
    response.message = cardAdd.message;
    return res.status(400).send(response);
  }
  
  var obj = {};
  obj.member_seq = token.member_seq;
  obj.card_key = cardAdd.response.customer_uid;
  const record = await service.create(obj);
  if(record[1]){
    response.success = true;
  }
  
  return res.status(200).send(response);
};

/**
 * 카드리스트
 */
exports.list = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

 /**
   * 어세스 토큰 가져오기
   */
  const getToken = await request({
    url: 'https://api.iamport.kr/users/getToken',
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    form: {
        imp_key: env_data.impkey,
        imp_secret: env_data.impsecret,
    },
    json: true,
  })

  const card_list = await service.card(token);
  if(card_list && card_list.length){
    var customer_uid = "";
    for(var i = 0 ; i < card_list.length ; i++){
      customer_uid += "customer_uid[]="+card_list[i].card_key+"&"
    }
    customer_uid = customer_uid.substring(0, (customer_uid.length-1))

    /**
     * 아임포트 카드리스트 가져오기
     */
    const cardResult = await request({
      method: 'GET',
      url: 'https://api.iamport.kr/subscribe/customers?'+customer_uid,
      headers: { "Authorization": getToken.response.access_token },
      json: true,
    })
    console.log(cardResult);



    for(var x = 0 ; x < card_list.length ; x++){
        for(var i = 0 ; i < cardResult.response.length ; i++){
          if(cardResult.response[i].customer_uid == card_list[x].card_key){
            cardResult.response[i].is_payment = card_list[x].is_payment;
            cardResult.response[i].card_seq = card_list[x].card_seq;
          }
      }
    }

    response.success = true;
    response.data = cardResult.response;
  }else{
    response.data = [];
  }
 
    
  return res.status(200).send(response);
};


/**
 * 카드삭제
 */
exports.delete = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

 /**
   * 어세스 토큰 가져오기
   */
  const getToken = await request({
    url: 'https://api.iamport.kr/users/getToken',
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    form: {
        imp_key: env_data.impkey,
        imp_secret: env_data.impsecret,
    },
    json: true,
  })

  /**
   * 아임포트 카드 삭제하기
   */
  const cardResult = await request({
    method: 'DELETE',
    url: 'https://api.iamport.kr/subscribe/customers/'+req.params.card_key,
    headers: { "Authorization": getToken.response.access_token },
    json: true,
  })
  console.log(cardResult);

  if(cardResult.code != '0'){
    response.message = cardResult.message;
    return res.status(400).send(response);
  }

  const record = await service.delete(req.params);
  if(record[0].changedRows){
    response.success = true;
  } 

 
    
  return res.status(200).send(response);
};


/**
 * 대표카드 변경
 */
exports.is_payment_update = async (req, res) => {
  const resData = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }


  const record = await service.is_payment_not_update(token);
  if(record[0].changedRows){
    
    const recordU = await service.is_payment_update(req.params);
    if(record[0].changedRows){
      response.success = true;
    }
  } 

 
    
  return res.status(200).send(response);
};
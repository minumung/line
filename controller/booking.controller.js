const service = require('../service/booking.service');
const cardService = require('../service/card.service');
const playService = require('../service/play.service');
const response = require('../infra/vars')
const env_data = require('../infra/env_data')
const commonJwt = require('../common/common_jwt');
const request = require('request-promise-native');
const crypto = require('crypto');


/**
 *
 * 매니저 입장 매치에 대한 예약자 리스트
 */
exports.maneger_list = async (req, res) => {
  const resData = {};
  const list = await service.maneger_list(req.body);
  response.success = true;
  response.data = list;
  return res.status(200).send(response);
};
/**
 *
 * 사용자 입장 내 예약 리스트
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
 * 예약하기
 */
exports.create = async (req, res) => {
  const resData = {};
  const resCard = {};
  const resPlay = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }



  const booking_cnt = await service.booking_cnt(req.body);
  if(booking_cnt.length) Object.assign(resData, booking_cnt[0]);

  var cnt = parseInt(req.body.cnt); //예약 요청 인원수
  var current_cnt = parseInt(resData.cnt); //현재 예약자 수
  var max_cnt = parseInt(resData.max); //최대 인원수

  if((current_cnt+cnt) > max_cnt){
    response.message = "최대 인원수를 초과하였습니다.";
    return res.status(400).send(response);
  }

  const read = await cardService.is_payment(token);
  if(read.length) {
    Object.assign(resCard, read[0]);
  }else{
    response.message = "대표 결제카드를 등록해주세요.";
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

  const play_read = await playService.read(req.body);
  if(play_read.length) {
    Object.assign(resPlay, play_read[0]);
  }

  const merchant_uid = crypto.randomBytes(40).toString('hex');
  var real_price = resPlay.price*cnt;
  const paymentresult = await request({
    method: 'POST',
    url: 'https://api.iamport.kr/subscribe/payments/again',
    headers: { "Authorization": getToken.response.access_token },
    form: {
      customer_uid: resCard.card_key,
      merchant_uid: merchant_uid,
      amount: real_price,
      name: resPlay.play_day + " " + resPlay.start_time + "(" + resPlay.name + " " + resPlay.detail_name + ")",
    },
    json: true,
  })
  console.log(paymentresult)
  if (paymentresult.code != '0') {
      response.message = paymentresult.message;
      return res.status(400).send(response);
  }

  const record = await service.create(req.body, token, paymentresult.response);
  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};


/**
 * 예약취소
 */
exports.delete = async (req, res) => {
  const resData = {};
  const resImpuid = {};
  const token = await commonJwt.tokenCheck(req.headers.authorization);
  
  if(!token){
    response.message = "사용자인증 토큰이 잘못되었습니다.";
    return res.status(400).send(response);
  }

  const time = await playService.chk_time(req.body);
  if(time.length) Object.assign(resData, time[0]);

  let today = new Date();   
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate();  // 날짜
  let hour = today.getHours();
  let min = today.getMinutes();

  var current_time = year+"-"+month+"-"+date+" "+hour+":"+min;
  var cancel_time = new Date(current_time)
  cancel_time.setHours(cancel_time.getHours()+3);

  var play_time = resData.play_day+" "+(resData.start_time.length == 2 ? resData.start_time : '0'+resData.start_time) + ":00";
  var match_time = new Date(play_time)


  if(cancel_time>match_time){
    response.message = "예약취소는 경기시간 3시간전까지만 가능합니다.";
    return res.status(400).send(response);
  }
  

  const impuids = await service.impuids(req.body, token);
  if(impuids.length) {
    Object.assign(resImpuid, impuids[0]);
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
  const cancelresult = await request({
    method: 'POST',
    url: 'https://api.iamport.kr/payments/cancel',
    headers: { "Authorization": getToken.response.access_token },
    form: {
      imp_uid: resImpuid.imp_uid,
    },
    json: true,
  })
  console.log(cancelresult)

  if(cancelresult.code != '0'){
    response.message = cancelresult.message;
    return res.status(400).send(response);
  }

  const record = await service.delete(req.body, token);
  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};
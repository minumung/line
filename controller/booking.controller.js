const service = require('../service/booking.service');
const playService = require('../service/play.service');
const response = require('../infra/vars')
const commonJwt = require('../common/common_jwt');



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

  const record = await service.create(req.body, token);
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
  

  const record = await service.delete(req.body, token);
  if(record[1]){
    response.success = true;
  }
  return res.status(200).send(response);
};
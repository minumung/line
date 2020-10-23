var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require("./models/index.js");
const common = require('./common/common')


/**
 * 프로파일 지정  테스트
 * 윈도우 : set NODE_ENV=local&&npm start로 실행
 * 리눅스 : export NODE_ENV=local&&npm start로 실행
 */
var dotenv = require('dotenv');
dotenv.config({           
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV = ".env."+process.env.NODE_ENV
  )
});



var app = express();

/**
 * 미들웨어 request가 오면 무조건 거친다
 */
app.use(function (req, res, next) { 
  
  /**
   * response meta 데이터 초기화
   */
  common.reset(); 
  next();
});

/**
 * 뷰 엔진 셋팅 HTML로 셋팅함
 */
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * 라우터 설정
 */
var indexRouter = require('./routes/index.route');
var adminRoutes = require('./routes/admin.route');

var areaRoutes = require('./routes/area.route');
var bookingRoutes = require('./routes/booking.route');
var bookmarkRoutes = require('./routes/bookmark.route');
var cardRoutes = require('./routes/card.route');
var manegerRoutes = require('./routes/maneger.route');
var memberRoutes = require('./routes/member.route');
var paymentRoutes = require('./routes/payment.route');
var playRoutes = require('./routes/play.route');
var stadiumRoutes = require('./routes/stadium.route');

app.use('/', indexRouter);
app.use('/api/v1/admin', adminRoutes);

app.use('/api/v1/area', areaRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/bookmark', bookmarkRoutes);
app.use('/api/v1/card', cardRoutes);
app.use('/api/v1/maneger', manegerRoutes);
app.use('/api/v1/member', memberRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/play', playRoutes);
app.use('/api/v1/stadium', stadiumRoutes);




/**
 * 404에러시 실행될 함수
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * 에러시 실행될 함수
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * DB 연결 체크
 */
models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});

module.exports = app;

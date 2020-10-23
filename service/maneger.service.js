var models = require("../models/index.js");

//회원가입
exports.join = async ( body ) => {
  var query = `
    insert into maneger(email, password, name, phone, content, maneger_img, create_dt) 
    values( '${body.email}', password('${body.password}'), '${body.name}', '${body.phone}', '${body.content}', '${body.maneger_img}', now());
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });
  return rstData;
};


//로그인
exports.login = async ( body ) => {
    var query = `
        select
            *
        from
        maneger
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            access_yn = 'Y' and
            email = '${body.email}' and
            password = password('${body.password}')
    `;
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      raw: true,
    });
    return rstData;
};

//member_seq로 사용자 정보 가져오기
exports.user_info = async ( body ) => {
    var query = `
        select
            *
        from
            maneger
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            access_yn = 'Y' and
            maneger_seq = ${body.maneger_seq}
    `;
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      raw: true,
    });
    return rstData;
};

//출석체크 변경
exports.chk_update = async ( body ) => {
    var query = `
        update
            booking
        set
            chk = 'Y'
        where
            booking_seq = ${body.booking_seq}
    `;
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.update,
      raw: true,
    });
    return rstData;
  };
  
//매치 완료처리
exports.chk_play = async ( body ) => {
    var query = `
        update
            play
        set
            is_play = 'Y'
        where
            play_seq = ${body.play_seq}
    `;
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.update,
      raw: true,
    });
    return rstData;
  };
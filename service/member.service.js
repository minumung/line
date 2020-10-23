var models = require("../models/index.js");

//회원가입
exports.join = async ( body ) => {
  var query = `
    insert into member(email, password, name, phone, sex, create_dt) 
    values( '${body.email}', password('${body.password}'), '${body.name}', '${body.phone}', '${body.sex}', now());
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.create,
    raw: true,
  });
  return rstData;
};

//회원탈퇴
exports.joinOut = async ( body ) => {
    var query = `
        update
            member
        set
            show_yn = 'N'
        where
            member_seq = ${body.member_seq}
    `;
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.update,
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
            member
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
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
            member
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            member_seq = ${body.member_seq}
    `;
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      raw: true,
    });
    return rstData;
};


//회원수정
exports.update = async ( body, token ) => {
  var query = `
      update
          member
      set
          name = '${body.name}',
          phone = '${body.phone}'
      `;
      if(body.password){
        query+=`, password = password('${body.password}')`;
      }
      query+=`
      where
          member_seq = ${token.member_seq}
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.update,
    raw: true,
  });
  return rstData;
};
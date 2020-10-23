var models = require("../models/index.js");

//내 즐겨찾기 경기장 리스트
exports.list = async ( body ) => {
  var query = `
    select
        stadium_seq
    from
        bookmark
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

//즐겨찾는 경기장 기존꺼 전부 삭제
exports.bookmarkAllDelete = async ( body) => {
    var query = `
            update
                bookmark
            set
                delete_yn = 'Y'
            where
                member_seq = ${body.member_seq}
        `
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.update ,
      raw: true,
    });
    return rstData;
  };

//즐겨찾는 경기장 추가
exports.bookmarkAllCreate = async ( body, bookmarkList) => {
    var query = `
        insert into bookmark(member_seq, stadium_seq, create_dt) values
        `;
        for(var i = 0 ; i < bookmarkList.length ; i++){
            query+=`('${body.member_seq}', '${bookmarkList[i].stadium_seq}', now()),`;
        }
        query = query.substring(0, (query.length-1));
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.create,
      raw: true,
    });
    return rstData;
  };
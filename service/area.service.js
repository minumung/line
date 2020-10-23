var models = require("../models/index.js");

//지역 리스트
exports.list = async ( body ) => {
  var query = `
    select
        area_seq,
        name
    from
        area
    where
        show_yn = 'Y' and
        delete_yn = 'N'
    order by
        sort asc, name asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


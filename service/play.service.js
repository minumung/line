var models = require("../models/index.js");

//매니저 입장의 나의 매치 리스트
exports.maneger_list = async ( token) => {
  var query = `
    select
        p.play_seq,
        s.name,
        sd.name detail_name,
        p.sex,
        p.play_day,
        p.start_time,
        p.end_time,
        p.levels,
        p.cnt,
        p.play_opt,
        (select count(*) cnt from booking where p.play_seq = play_seq) booking_cnt,
        case
          when date_format(now(), '%Y%m%d%H%i') > date_format(concat(p.play_day, ' ', p.start_time), '%Y%m%d%H%i') then 'Y'
          else 'N'
        end is_before
    from
        play p
        left join stadium_detail sd on p.detail_seq = sd.detail_seq
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join maneger m on p.maneger_seq = m.maneger_seq
    where
        p.show_yn = 'Y' and
        p.delete_yn = 'N' and
        m.maneger_seq = ${token.maneger_seq}
    order by
	      p.play_day desc, p.start_time desc
    `;  
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//매치 리스트
exports.list = async ( body, bookmarkList) => {
  var query = `
    select
        p.play_seq,
        s.name,
        sd.name detail_name,
        p.sex,
        p.start_time,
        p.end_time,
        p.levels,
        p.cnt,
        p.play_opt,
        (select count(*) cnt from booking where p.play_seq = play_seq) booking_cnt,
        m.name maneger_name
    from
        play p
        left join stadium_detail sd on p.detail_seq = sd.detail_seq
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join maneger m on p.maneger_seq = m.maneger_seq
    where
        p.show_yn = 'Y' and
        p.delete_yn = 'N' and
        date_format(now(), '%Y%m%d%H%i') <= date_format(concat('${body.play_day} ', p.start_time), '%Y%m%d%H%i') and
        p.play_day = '${body.play_day}'
    `;  
    if(bookmarkList != null && bookmarkList.length){
        query += `and s.stadium_seq in(0`;
        for(var i = 0 ; i < bookmarkList.length ; i++){
            query += `, ${bookmarkList[i].stadium_seq}`;
        }
        query += `)`;
    }  
    query += `order by
        p.start_time asc
  `;
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};


//매치 상세
exports.read = async ( body ) => {
    var query = `
    select
        p.play_seq,
        s.name,
        s.addr,
        sd.name detail_name,
        sd.content,
        sd.size,
        p.price,
        p.min,
        p.max,
        p.sex,
        p.start_time,
        p.end_time,
        p.play_day,
        p.levels,
        p.cnt,
        p.play_opt,
        (select count(*) cnt from booking where p.play_seq = play_seq) booking_cnt,
        m.maneger_img,
        m.name maneger_name,
        m.content maneger_content
    from
        play p
        left join stadium_detail sd on p.detail_seq = sd.detail_seq
        left join stadium s on sd.stadium_seq = s.stadium_seq
        left join maneger m on p.maneger_seq = m.maneger_seq
    where
        p.play_seq = '${body.play_seq}'
      `;  
    var rstData = await models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      raw: true,
    });
  
    return rstData;
  };

//매치 상세
exports.chk_time = async ( body ) => {
  var query = `
  select
      p.start_time,
      p.end_time,
      p.play_day
  from
      play p
  where
      p.play_seq = '${body.play_seq}'
    `;  
  var rstData = await models.sequelize.query(query, {
    type: models.sequelize.QueryTypes.SELECT,
    raw: true,
  });

  return rstData;
};

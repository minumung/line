var models = require("../models/index.js");

//카드등록
exports.create = async ( body ) => {
    var query = `
        insert into card(member_seq, card_key, create_dt) 
        values( '${body.member_seq}', '${body.card_key}', now());
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.create,
        raw: true,
    });
    return rstData;
};

//member_seq로 사용자 정보 가져오기
exports.card = async ( body ) => {
    var query = `
        select
            card_key,
            is_payment,
            card_seq
        from
            card
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            member_seq = ${body.member_seq}
        order by
            is_payment desc
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
    });
    return rstData;
};

//대표카드 가져오기
exports.is_payment = async ( body ) => {
    var query = `
        select
            card_key,
            is_payment
        from
            card
        where
            show_yn = 'Y' and
            delete_yn = 'N' and
            is_payment = 'Y' and
            member_seq = ${body.member_seq}
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT,
        raw: true,
    });
    return rstData;
};

//카드삭제
exports.delete = async ( body ) => {
    var query = `
        update
            card
        set
            delete_yn = 'Y'
        where
            card_key = '${body.card_key}'
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.update,
        raw: true,
    });
    return rstData;
};

//대표카드 수정 1번째 / 모든 카드를 대표카드가 아니게 만들기
exports.is_payment_not_update = async ( token ) => {
    var query = `
        update
            card
        set
            is_payment = 'N'
        where
            member_seq = '${token.member_seq}'
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.update,
        raw: true,
    });
    return rstData;
};

//대표카드 수정 1번째 / 모든 카드를 대표카드가 아니게 만들기
exports.is_payment_update = async ( body ) => {
    var query = `
        update
            card
        set
            is_payment = 'Y'
        where
            card_key = '${body.card_key}'
    `;
    var rstData = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.update,
        raw: true,
    });
    return rstData;
};

const up = function (knex) {
    return knex.raw(`CREATE VIEW view_tickets AS (
        SELECT
            a.*, 
            b.organization_name, 
            c.name AS category_name, 
            d.sub_name AS category_sublv1_name, 
            e.sub_name AS category_sublv2_name, 
            f.sub_name AS category_sublv3_name,
            g.cust_name,
            g.cust_email,
            g.cust_telephone,
            g.cust_address
        FROM
            tickets as a
            LEFT OUTER JOIN organizations as b ON b.id=a.org_id
            LEFT OUTER JOIN category as c ON c.category_id=a.category_id
            LEFT OUTER JOIN category_sub_lv1 as d ON d.category_sublv1_id=a.category_sublv1_id
            LEFT OUTER JOIN category_sub_lv2 as e ON e.category_sublv2_id=a.category_sublv2_id
            LEFT OUTER JOIN category_sub_lv3 as f ON f.category_sublv3_id=a.category_sublv3_id
            LEFT OUTER JOIN ticket_detail as g ON g.ticket_number=a.ticket_number
    )`);
};

const down = function (knex) {
    return knex.raw(`DROP VIEW view_tickets`);
};

module.exports = { up, down }

exports.seed = function (knex) {
    return knex('menu_access').truncate()
        .then(function () {
            return knex('menu_access').insert([
                { 
                    access: 'menu', 
                    user_level: 'Administrator', 
                    menu_id:'8', 
                    menu_modul_id: '0', 
                    menu_submodul_id: '0',
                    user_create: 'admin',
                    created_at: knex.fn.now(),
                },{ 
                    access: 'modul', 
                    user_level: 'Administrator', 
                    menu_id:'8', 
                    menu_modul_id: '22', 
                    menu_submodul_id: '0',
                    user_create: 'admin',
                    created_at: knex.fn.now(),
                },{ 
                    access: 'modul', 
                    user_level: 'Administrator', 
                    menu_id:'8', 
                    menu_modul_id: '23', 
                    menu_submodul_id: '0',
                    user_create: 'admin',
                    created_at: knex.fn.now(),
                },
            ]);
        });
}

const shoppingListService = {
  getFullList(knex) {
    return knex.select("*").from("shopping_list");
  },
  getItemById(knex, id) {
    return knex.select("*").from("shopping_list").where({ id }).first();
  },
  updateItem(knex, id, item) {
    return knex('shopping_list').where({id}).update(item);
  },
  async insertItem(knex, item) {
    const rows = await knex("shopping_list").insert(item).returning("*");
    return rows[0];
  },
  deleteItem(knex,id) {
    return knex('shopping_list').where({id}).delete();
  },
};

module.exports = shoppingListService;

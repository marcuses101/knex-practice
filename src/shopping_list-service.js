const shoppingListService = {
  getFullList(){return Promise.resolve('Full list')},
  getItemById(){return Promise.resolve('Item by Id')},
  updateItem(){return Promise.resolve('Update Item')},
  insertItem(){return Promise.resolve('Inserted Item')},
  deleteItem(){return Promise.resolve('full list excluding deleted item')},
}

module.exports = shoppingListService
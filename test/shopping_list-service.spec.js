require("dotenv").config();
const { expect } = require("chai");
const knex = require("knex");
const { before } = require("mocha");
const shoppingListService = require("../src/shopping_list-service");

describe(`shoppingListService object`, () => {
  let db = {};
  const testItems = [
    {
      id: 1,
      name: "chicken",
      price: 18.85,
      date_added: new Date(),
      checked: true,
      category: "Main",
    },
    {
      id: 2,
      name: "cheese",
      price: 14.85,
      date_added: new Date(),
      checked: true,
      category: "Snack",
    },
    {
      id: 3,
      name: "coffee",
      price: 10,
      date_added: new Date(),
      checked: false,
      category: "Main",
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => {
    return db("shopping_list").truncate();
  });

  after(() => {
    db.destroy();
  });

  context("Shopping list table has data", () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    afterEach(() => {
      return db("shopping_list").truncate();
    });

    it(`gets all items from the 'shopping_list' table`, () => {
      return shoppingListService.getFullList(db).then((actual) => {
        expect(actual).to.eql(testItems);
      });
    });

    it(`getItemById() resolves an article by id from 'shopping_list' table`, () => {
      const id = 1;
      const referenceItem = testItems.find((item) => item.id == id);
      return shoppingListService
        .getItemById(db,id)
        .then((actual) => expect(actual).to.eql(referenceItem));
    });

    it(`updateItem() updates the item at specified id from 'shopping_list' table`, () => {
      const idToUpdate = 2;
      const newItem = {
        name: "beef",
        price: 15.25,
        date_added: new Date(),
        checked: false,
        category: "Lunch",
      };
      return shoppingListService
        .updateItem(db, idToUpdate, newItem)
        .then(() => shoppingListService.getItemById(db, idToUpdate))
        .then((actual) => {
          expect(actual).to.eql({
            id: idToUpdate,
            ...newItem,
          });
        });
    });

    it(`deletes item with id from the 'shopping_list table`, () => {
      const itemId = 2;
      return shoppingListService
        .deleteItem(db, itemId)
        .then(() => shoppingListService.getFullList(db))
        .then((actual) => {
          const filteredList = testItems.filter((item) => item.id != itemId);
          expect(actual).to.eql(filteredList);
        });
    });
  });

  context("Shopping list table is empty", () => {

    it(`getFullList() resolves to an empty array from 'shopping_list' table`,()=>{
      return shoppingListService.getFullList(db)
      .then(actual=>expect(actual).to.eql([]))
    })

    it(`insertItem() resolve with item including id from 'shopping_list' table`, () => {
      const itemToInsert = {
        name: "Chickpeas",
        price: 2,
        date_added: new Date(),
        checked: false,
        category: "Lunch",
      };
      return shoppingListService
        .insertItem(db, itemToInsert)
        .then((actual) => expect(actual).to.eql({ id: 1, ...itemToInsert }));
    });
  });
});

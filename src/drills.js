require("dotenv").config();
const knex = require("knex");
const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

async function getByName(searchTerm) {
  const response = await knexInstance
    .select("*")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`);
  console.log(response);
}

async function getAllPaginated(pageNumber = 1) {
  const offset = 6 * (pageNumber - 1);
  const response = await knexInstance
    .select("*")
    .from("shopping_list")
    .limit(6)
    .offset(offset);
  console.log(response);
}

async function getAfterDate(daysAgo) {
  const response = await knexInstance
    .select("*")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    );
  console.log(response);
}

async function totalCostPerCategory() {
  const response = await knexInstance
    .select("category")
    .sum('price as total')
    .from("shopping_list")
    .groupBy("category");
  console.log(response);
}

totalCostPerCategory()
  .then(() => process.exit())
  .catch((e) => console.log(e));

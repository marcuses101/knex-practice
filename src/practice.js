require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

async function paginateProducts(page = 1, productsPerPage = 10) {
  const offset = productsPerPage * (page - 1);
  const results = await knexInstance
    .select("product_id", "name", "price", "category")
    .from("amazong_products")
    .limit(productsPerPage)
    .offset(offset);
  console.log(results);
}

async function getProductsWithImages() {
  const results = await knexInstance
    .select("product_id", "name", "price", "category", "image")
    .from("amazong_products")
    .whereNotNull("image");
  console.log(results);
}

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result)
    })
}

mostPopularVideosForDays(30)

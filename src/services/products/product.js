import express from "express";
import pool from "../../utils/db.js";

const productsRouter = express.Router();
productsRouter.get("/", async (req, res, next) => {
  console.log(req.query);
  try {
    if (req.query.category) {
      const query = `SELECET * FROM products WHERE category = ${
        "'" + req.query.category + "'"
      }`;
      const result = await pool.query(query);
      res.send(result.rows);
    } else {
      const query = `SELECT * FROM products`;
      const result = await pool.query(query);
      res.send(result.rows);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const query = `SELECT * FROM products WHERE  id =${req.params.id};`;

    const result = await pool.query(query);
    if (result.rows.length > 0) {
      const product = result.rows[0];
      const reviewsQuery = `SELECT * FROM reviews WHERE product_id =${req.params.id}`;
      const reviewsResult = await pool.query(reviewsQuery);
      const reviews = reviewsResult.rows;
      res.send({ product, reviews });
    } else {
      res
        .status(404)
        .send({ message: `product with ${req.params.id} is not found.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const query = `DELETE FROM products WHERE id=${req.params.id};`;
    await pool.query(query);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
productsRouter.post("/", async (req, res, next) => {
  try {
    const { name, description, brand, category, image_url, price } = req.body;
    const query = `
        INSERT INTO products
        (
     name, description, brand, category,image_url,price 
        )
        VALUES 
        (
            ${"'" + name + "'"},
            ${"'" + description + "'"},
            ${"'" + brand + "'"},
            ${"'" + category + "'"},
			    ${"'" + image_url + "'"},
				    ${"'" + price + "'"}
        ) RETURNING *;
        `;
    const result = await pool.query(query);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
productsRouter.put("/:id", async (req, res, next) => {
  try {
    const { name, description, brand, category, image_url, price } = req.body;
    const query = `
            UPDATE products 
            SET 
             name=${"'" + name + "'"},
           description = ${"'" + description + "'"},
            brand=${"'" + brand + "'"},
            category=${"'" + category + "'"},
			image_url=${"'" + image_url + "'"},
			price=${"'" + price + "'"}
            WHERE id=${req.params.id}
            RETURNING*;`;
    const result = await pool.query(query);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default productsRouter;

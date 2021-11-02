import express from "express";

import pool from "../../utils/db.js";
const reviewsRouter = express.Router();
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const query = `SELECT 
        review.id,
        review.comment,
        review.rate,
        review.product_id,
        product.name AS product_name,
        product.description,
        product.category,
        product.brand,
        product.image_url,
        product.price
    FROM reviews as review
    INNER JOIN products AS product ON review.product_id = product.id
    `;
    const result = await pool.query(query);
    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const query = `SELECT 
       review.id,
        review.comment,
        review.rate,
        review.price,
        review.product_id,
        product.name AS product_name,
        product.last_name,
        product.country,
        product.avatar
    FROM reviews as review
    INNER JOIN products AS product ON review.product_id = product.id
    WHERE book_id=${req.params.id};`;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      res.send(result.rows[0]);
    } else {
      res
        .status(404)
        .send({ message: `Book with ${req.params.id} is not found.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const query = `DELETE FROM reviews WHERE id=${req.params.id};`;
    await pool.query(query);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const { comment, rate, product_id } = req.body;
    const query = `
            UPDATE reviews 
            SET 
                comment=${"'" + comment + "'"},
                rate=${"'" + rate + "'"},
                product_id=${"'" + product_id + "'"},
                updated_at= NOW()
            WHERE id=${req.params.id}
            RETURNING*;`;
    const result = await pool.query(query);
    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { rate, comment, product_id } = req.body;
    const query = `
        INSERT INTO reviews
        (
            rate,
            comment,
            product_id
        )
        VALUES 
        (
            ${"'" + rate + "'"},
            ${"'" + comment + "'"},
            ${"'" + product_id + "'"}
        ) RETURNING *;       
         `;
    const result = await pool.query(query);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default reviewsRouter;

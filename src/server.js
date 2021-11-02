import express from "express";
import cors from "cors";
import createTables from "../src/utils/createTable.js";

import productsRouter from "./services/products/product.js";
import reviewsRouter from "./services/reviews/review.js";

const server = express();
const { PORT = 5000 } = process.env;

server.use(cors());
server.use(express.json());

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

server.listen(PORT, async () => {
  console.log(`server is listening on port ${PORT}`);
  await createTables();
});

server.on("error", (error) => {
  console.log("server is stopped", error);
});

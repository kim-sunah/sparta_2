const express = require("express");
const app = express();
const port = 8080;

const productsRouter = require("./routes/products.router.js");

const connect = require("./schemas");
connect();

app.use(express.json());
app.use("/api", productsRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});

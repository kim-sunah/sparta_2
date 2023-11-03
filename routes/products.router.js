const express = require("express");
const router = express.Router();
const Products = require("../schemas/products.schema.js");

//상품등록
router.post("/products", async (req, res) => {
  const { title, content, author, password } = req.body;
  const products = await Products.find({}).sort({ id: -1 });
  const id = products.length === 0 ? 1 : Number(products[0].id) + 1;
  try {
    await Products.create({
      id: id,
      password,
      title,
      content,
      author,
      status: "FOR_SALE",
      createdAt: new Date(),
    });
    res.json({ message: "판매 상품을 등록하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(404).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
});

//상품목록조회
router.get("/products", async (req, res) => {
  const products = await Products.find({}).sort({ id: -1 });
  const result = products.map((data) => {
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      status: data.status,
      createdAt: data.createdAt,
    };
  });
  res.json({ date: result });
});

//상품 상세조회
router.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const products = await Products.find({ id: Number(productId) });
  try {
    const result = products.map((data) => {
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        status: data.status,
        createdAt: data.createdAt,
      };
    });
    res.json({ date: result });
  } catch (err) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//상품 정보 수정
router.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { title, content, password, status } = req.body;
  const products = await Products.find({ id: Number(productId) });
  console.log(req.body);
  console.log(products);
  if (!products.length) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  } else if (password !== products[0].password) {
    res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
  } else {
    try {
      await Products.findByIdAndUpdate(productId._id, {
        title,
        content,
        status,
      });
      res.send({ message: "게시글을 수정하였습니다." });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

//상품 삭제
router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;
  const products = await Products.find({ id: Number(productId) });
  if (!products.length) {
    res.status(404).json({ message: "게시글 조회에 실패하였습니다." });
  } else if (password !== products[0].password) {
    res.status(400).json({ message: "비밀번호가 맞지 않습니다." });
  } else {
    try {
      await Products.deleteOne({ id: Number(productId) });
      res.json({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

module.exports = router;

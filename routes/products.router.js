const express = require("express");
const router = express.Router();
const Products = require("../schemas/products.schema.js");
require("dotenv").config();
const api_basic = process.env.API_BASIC;
const api_detail = process.env.API_DETAIL;

//상품등록
router.post(api_basic, async (req, res) => {
  const { title, content, author, password } = req.body;
  try {
    await Products.create({
      password,
      title,
      content,
      author,
    });
    res.json({ message: "판매 상품을 등록하였습니다." });
  } catch (err) {
    res.status(404).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
});

//상품목록조회
router.get(api_basic, async (req, res) => {
  const products = await Products.find({}).sort({ createdAt: -1 });

  res.json({ date: products });
});

//상품 상세조회
router.get(api_detail, async (req, res) => {
  const { productId } = req.params;
  const products = await Products.findOne({ _id: productId });
  if (products == null) {
    res.status(404).json({ message: "상품조회에 실패하였습니다." });
  } else {
    try {
      const result = {
        title: products.title,
        content: products.content,
        author: products.author,
        status: products.status,
        createdAt: products.createdAt,
      };
      res.json({ date: result });
    } catch (err) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

//상품 정보 수정
router.put(api_detail, async (req, res) => {
  const { productId } = req.params;
  const { title, content, password, status } = req.body;
  const products = await Products.findOne({ _id: productId });
  if (products == null) {
    res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    return
  } else if (password !== products.password) {
    res.status(401).json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    return
  }
  try {
    await Products.updateOne(
      { _id: productId },
      { $set: { title, content, password, status } },
    );
    res.send({ message: "상품 정보를 수정하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

//상품 삭제
router.delete(api_detail, async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;

  const products = await Products.find({ _id: productId });

  if (products == null) {
    res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  } else if (password !== products[0].password) {
    res
      .status(401)
      .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
  } else {
    try {
      await Products.deleteOne({ _id: productId });
      res.json({ message: "상품을 삭제하였습니다." });
    } catch (err) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

module.exports = router;

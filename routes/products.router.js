const express = require("express");
const router = express.Router();
const Products = require("../schemas/products.schema.js");
require("dotenv").config();
const api_basic = process.env.API_BASIC;
const api_detail = process.env.API_DETAIL;

//상품등록
router.post(api_basic, async (req, res) => {
  const { title, content, author, password } = req.body;
  const products = await Products.find({}).sort({ id: -1 });
  const id = products.length === 0 ? 1 : Number(products[0].id) + 1;
  const seoulTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const utcDateString = `${seoulTime.getFullYear()}-${(seoulTime.getMonth() + 1).toString().padStart(2, "0")}-${seoulTime.getDate().toString().padStart(2, "0")}T${seoulTime.getHours().toString().padStart(2, "0")}:${seoulTime.getMinutes().toString().padStart(2, "0")}:${seoulTime.getSeconds().toString().padStart(2, "0")}.${seoulTime.getMilliseconds()}Z`;
  
  console.log(utcDateString);
  try {
    await Products.create({
      id: id,
      password,
      title,
      content,
      author,
      status: "FOR_SALE",
      createdAt:utcDateString,
    });
    res.json({ message: "판매 상품을 등록하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(404).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
});

//상품목록조회
router.get(api_basic, async (req, res) => {
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
router.get(api_detail, async (req, res) => {
  const { productId } = req.params;
  const products = await Products.find({ id: Number(productId) });
  if (products.length == 0) {
    res.status(404).json({ message: "상품조회에 실패하였습니다." });
  } else {
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
  }
});

//상품 정보 수정
router.put(api_detail, async (req, res) => {
  const { productId } = req.params;
  const { title, content, password, status } = req.body;
  const products = await Products.find({ id: Number(productId) });
  console.log(req.body);
  console.log(products);
  if (!products.length) {
    res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  } else if (password !== products[0].password) {
    res
      .status(401)
      .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
  } else {
    try {
      await Products.updateOne({id : productId,$set: {
        title,
        content,
        status,
      }});
      res.send({ message: "상품 정보를 수정하였습니다." });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

//상품 삭제
router.delete(api_detail, async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;
  const products = await Products.find({ id: Number(productId) });
  if (!products.length) {
    res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  } else if (password !== products[0].password) {
    res
      .status(401)
      .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
  } else {
    try {
      await Products.deleteOne({ id: Number(productId) });
      res.json({ message: "상품을 삭제하였습니다." });
    } catch (err) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
  }
});

module.exports = router;

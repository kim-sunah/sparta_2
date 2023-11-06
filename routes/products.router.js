const express = require("express");
const router = express.Router();
const Products = require("../schemas/products.schema.js");
require("dotenv").config();
const api_basic = process.env.API_BASIC;
const api_detail = process.env.API_DETAIL;
console.log(api_basic)
console.log(api_detail)

//상품등록
router.post(api_basic, async (req, res) => {
  const { title, content, author, password } = req.body;
  const products = await Products.find({}).sort({ id: -1 });
  const id = products.length === 0 ? 1 : Number(products[0].id) + 1;
  const seoulTimeOffset = 9 * 60; // 한국 시간대 (UTC+9)의 분 단위 오프셋
  const currentDate = new Date();
  const seoulTime = new Date(currentDate.getTime() + seoulTimeOffset * 60000); // 시간 오프셋 적용
  
  // UTC 형식으로 저장
  const utcDateString = seoulTime.toISOString();
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
      id: data._id,
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
  if(typeof productId !== Number){
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }else{
    const products = await Products.findOne({ id: productId });
    if (products == null) {
      res.status(404).json({ message: "상품조회에 실패하였습니다." });
    } else {
      try {
        const result ={
            id: products._id,
            title: products.title,
            content: products.content,
            author: products.author,
            status: products.status,
            createdAt: products.createdAt,
          };
        res.json({ date: result });
      } catch (err) {
        console.error(err);
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      }
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

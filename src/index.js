import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import {addProduct, getAllProduct} from "../db/operations/product.js";
import { registerUser, loginUser, addProductOnCard, getProductsByUserId, joinTable } from "../db/operations/user.js";


import knex from "../db/db.js";


dotenv.config();
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors());
const port = process.env.PORT || 3000;



app.get("/", (req, res) => {
    const token = req.cookies.token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const id = data.id

    res.send( id );
});

app.post("/api/addProduct", async (req, res) => {
  try {
    const product = await addProduct(knex, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(201).json({ message: "Product added successfully", data: product });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await getAllProduct(knex);
    res.json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
})


app.post("/api/user/register", async (req, res) => {
  try {
      await registerUser(knex, req.body);
      return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
  }
})

app.post("/api/user/login", async (req, res) => {
  try {
      const {user,token} = await loginUser(knex, req.body, res);
      if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
      } else{
          res.cookie("token", token,{
              httpOnly: false,
              secure:true,
              expiresIn: '1Days',
              sameSite: 'none',
          })
      }      
      return res.json({ message: "Logged in successfully", user, token });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
  }
})

app.post("/api/user/addProductOnCard", async (req, res) => {
  try {
    console.log(req.body);
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) return res.status(401).json({ message: "Unauthorized" });
    const id = data.id
    const user = await knex("users").where("id", id).first();
    if (!user) return res.status(404).json({ message: "User not found" });
    const { productId, quantity } = req.body;
    await addProductOnCard(knex, user.id, productId, quantity);
    res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error);
  }
})

app.get("/api/user/getProductsByUserId", async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) return res.status(401).json({ message: "Unauthorized" });
    const userId = data.id
    const products = await getProductsByUserId(knex, userId);
    res.json({ message: "Products fetched successfully", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
})

app.get("/api/table/joinTable", async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) return res.status(401).json({ message: "Unauthorized" });
    const userId = data.id
    const result = await joinTable(knex, userId);
    res.json({ message: "Table joined successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message,});
    console.error(error);
  }
 
})


app.listen(port, () => {
    console.log(`app listining on port http://localhost:${port}`);
});
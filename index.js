const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");


const app=express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Routes
const{ router: authRouter, authenticateJWT} = require("./auth");
const cartRouter = require("./cart");
app.use("/auth", authRouter);
app.use("/cart",cartRouter);


mongoose.connect("mongodb+srv://arshdeep62097:M8EiblkB6bJm3yEX@cluster0.whgrskn.mongodb.net/ecommerce");

const Product = require("./models/Product");

//Product routes
app.get("/product", async (req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "There is internal server error" });
    }
});

app.get("/product/:id", async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({message: "The items that you were searching for is not exist" });
        } else{
            res.json(product);
        }
    } catch(error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(8000, ()=>{
    console.log("Server is running on port 8000");
})
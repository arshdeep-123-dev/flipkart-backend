const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//Cart Schema
const Cart = mongoose.model('Cart', new mongoose.Schema({
    userId: String,
    items: [{
        productId: String,
        quantity: Number
    }],
    status: {
        type: String,
        default: 'active'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}));

//Add item to cart
router.post('/cart/add', async (req, res) => {
    try{
        const {productId, quantity=1, userId} = req.body;
        if(!productId || !userId) {
            return res.status(400).json({ message: "Product ID and User ID are required" });
        }

        let cart = await Cart.findOne({ userId: userId, status: 'active'});

        if(!cart) {
            cart = new Cart({ userId: userId, items: [], status: 'active'});
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

        if(existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({ productId, quantity: parseInt(quantity)});
        }
        cart.updatedAt = new Date();
        await cart.save();
        res.status(200).json({ message: "Item added to cart successfully" });
    } catch(err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({error: "Internal server error, item have not been added"});
    }
});

//Get cart items
router.get('/carts', async(req, res) => {
    try{
        const carts = await Cart.find();
        
        res.status(200).json({
            success: true,
            count: carts.length,
            data: carts
        });
    } catch (error) {
        console.log("Error fetching carts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data",
            error: error.message,
        });
    }
});

//Delete router - assignment
router.delete('/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findByIdAndDelete(id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
// Note: Ensure to import and use this router in your main app file (e.g., index.js) like this:
// const cartRouter = require('./cart');
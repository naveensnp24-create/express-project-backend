const express=require("express");
const Product=require("../models/Product");
const authmiddleware = require("../middleware/authmiddleware");
const fs = require("fs");
const router=express.Router()

router.get("/test", async (req, res) => {
    try {
        const testProduct = new Product({
            name: "Test Product",
            price: 100,
            image: "test.jpg"
        });
        const saved = await testProduct.save();
        res.json({message: "Test successful", product: saved});
    } catch (error) {
        res.status(500).json({error: error.message, stack: error.stack});
    }
});

router.get("/", async (req,res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log('Database error, using JSON fallback:', error.message);
        try {
            const productsData = fs.readFileSync("./data/products.json", "utf8");
            res.json(JSON.parse(productsData));
        } catch (fileError) {
            res.status(500).json({error: "Failed to load products"});
        }
    }
});

router.get("/:id", async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({error: "Product not found"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post("/", authmiddleware, async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description,
            stock: req.body.stock || 0
        });
        
        const savedProduct = await newProduct.save();
        res.status(201).json({message: "Product created successfully", product: savedProduct});
    } catch (error) {
        console.error('POST /products - Error:', error);
        res.status(400).json({error: error.message});
    }
})

router.delete("/:id", authmiddleware, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({error: "Product not found"});
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put("/:id", authmiddleware, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { 
                name: req.body.name, 
                price: req.body.price, 
                image: req.body.image,
                description: req.body.description,
                stock: req.body.stock
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({error: "Product not found"});
        }
        res.status(200).json({message: "Product updated successfully", product: updatedProduct});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports=router;
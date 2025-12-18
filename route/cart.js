// const express=require("express");
// const fs=require("fs");
// const router=express.Router();


// router.get("/",(req,res) => {
//     const cart=fs.readFileSync("data/cart.json");
//     res.json(JSON.parse(cart));
// });


// router.get("/:id",(req,res) => {
    
//     console.log("id = ",req.params.id)
//     const cart=JSON.parse(fs.readFileSync("data/cart.json"));
//     const item = cart.find((c) => {
//         return c.id === parseInt(req.params.id)
//     })
//     res.json(item);
// });

// router.post("/", (req, res) => {
//     const cart = JSON.parse(fs.readFileSync("data/cart.json"));
//     const { id, name, price, image, qty = 1 } = req.body;
    
//     const existingItem = cart.find(item => item.id === id);
    
//     if (existingItem) {
//         existingItem.qty += qty;
//     } else {
//         cart.push({ id, name, price, image, qty });
//     }
    
//     fs.writeFileSync("data/cart.json", JSON.stringify(cart, null, 2));
//     res.status(201).json({message:"Item added to cart successfully"});

// })


// router.delete("/:id", (req, res) => {
//     const data = fs.readFileSync("data/cart.json", "utf8");
//     const cart = JSON.parse(data);
//     const updatedCart = cart.filter(c => c.id !== parseInt(req.params.id));
//     fs.writeFileSync("data/cart.json", JSON.stringify(updatedCart, null, 2));
//     res.status(200).json({ message: "Item removed successfully" });
// });

// module.exports=router;



const express = require("express");
const { getCart, addToCart } = require("../controller/cartController");
const router = express.Router();

router.get("/", getCart);
router.post("/", addToCart);

module.exports = router;
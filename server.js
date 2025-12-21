// const http=require('http');

// const server=http.createServer((req,res)=>{
//     if(req.method==='GET' && req.url==='/'){
//         res.writeHead(202,{'Context-type':'application/json'});
//         res.end(JSON.stringify({message:"Helloo"}));
//     }
//     else if(req.method==='GET' && req.url==='/About'){
//         res.writeHead(202,{'Context-type':'application/json'});
//         res.end(JSON.stringify({message:"About"}));
//     }else{
//        res.writeHead(404,{'Context-type':'application/json'});
//         res.end(JSON.stringify({error:"Not Found"}));
//     }
// });

// server.listen(3000,()=>{
//      console.log('Server running at https://localhost/3000');


// })

// const express=require("express");
// const fs=require("fs");
// const app=express();
// // app.use(express.json())
// // const productsRouter=require('./routes/products');
// const productsRouter=required("./routes/products")
// const cors=require("cors")


// app.use(express.json());
// app.use(cors());




// app.use((req,res,next)=>{
//     console.log(`${req.method} ${req.url}`);
//     next();    
// })


// app.get("/", (req, res) => {
//     res.json({ message: "Hello Express" });
// });


// app.get("/about", (req, res) => {
//     res.json({ message: "About" });
// });




// app.use("/products",productsRouter);

// app.listen(3000, () => { 
//     console.log('Server running at http://localhost:3000/');
// });





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







// const http=require('http');

// const server=http.createServer((req,res)=>{
//     if(req.method==='GET' && req.url==='/'){
//         res.writeHead(200,{'Content-Type':'application.json'});
//         res.end(JSON.stringify({message:"Hello"}))
//     }
//     else if(req.method==='GET' && req.url==='/about'){
//         res.writeHead(200,{'content-type':'application/json'});
//         res.end(JSON.stringify({message:"About"}));
//     }else{
//         res.writeHead(404,{'content-type':'application/json'});
//         res.end(JSON.stringify({error:"Not Found"}));
//     }
// });

// server.listen(3000,()=>{
//     console.log(Server running at http://localhost:3000)
// })


// require('dotenv').config();
// const express = require("express");
// const fs=require("fs");
// const app = express();
// const cartRouter = require('./routes/cart');
// const cartRouter = require('./middleware/authmiddleware')
// const productsRouter=require("./routes/products");
// const studentsRouter=require("./routes/students");
// // const blogsRouter=require("./routes/blog");
// const cors=require("cors");

// const createDB=require("./config/db");
// createDB();


// app.use("/products",productsRouter)
// app.use("/students",studentsRouter)
// app.use(express.json())      //middleware -> it is a process which is between request and respond

// app.use(cors());
// app.use((req,res,next)=>{
//     console.log(`${req.method} ${req.url}`)
//     next();                 //Pass to next middleware/route
// })


// app.get("/", (req, res) => {
//     res.json({ message: "Hello Express" })
// })

// app.get("/about", (req, res) => {
//     res.json({ message: "About" });
// })


// app.get("/products", (req, res) => {
//     const products=fs.readFileSync("data/products.json");
//     res.json(JSON.parse(products))
// })


// app.get("/products/:id", (req, res) => {
//     const products=fs.readFileSync("data/products.json");
//     const product = JSON.parse(products).find((p) => {
//         return p.id === parseInt(req.params.id);
//     })
//     if (product) {
//         res.json(product)
//     } else {
//         res.status(404).json({ error: "Product not found" });
//     }
// })

// // app.get("/products/:id", (req, res) => {
// //     console.log("id =", req.params.id);
// //     const product = products.find((p) => {
// //         return p.id === parseInt(req.params.id);
// //     })
// //     if (product) {
// //         res.json(product)
// //     } else {
// //         res.status(404).json({ error: "Product not found" });
// //     }
// // })

// app.delete("/products/:id",(req,res)=>{
//     const products=fs.readFileSync("data/products.json");
//     const updateProducts=JSON.parse(products).filter((p)=>{
//         return p.id!==parseInt(req.params.id)
//     })
//     fs.writeFileSync("data/products.json",JSON.stringify(updateProducts,null,0));
//     res.status(200).json({message:"Product deleted successfully"});
// })

// app.post("/products",(req,res)=>{
//     const products=JSON.parse(fs.readFileSync("data/products.json"));
//     const newProduct = {
//         id:products[products.length-1].id+1,
//         name:req.body.name,
//         price:req.body.price,
//         image:req.body.image
//     }
//     const updateProducts=[...products,newProduct];
//     fs.writeFileSync("data/products.json",JSON.stringify(updateProducts,null,2))
//     res.status(201).json({message:"Product created successfully!"});
// })

// app.use("/products",productsRouter);
// app.use('/cart', cartRouter);

// // app.use("/blogs",blogsRouter)

// app.listen(3000, () => {
//     console.log("Server running at http://localhost:3000")
// })



require('dotenv').config();
const express = require("express");
const fs=require("fs");
const app = express();
const cartRouter = require('./route/cart');
const authmiddleware = require("./middleware/authmiddleware");
const productsRouter=require("./route/products");
const studentsRouter=require("./route/students");
const authRouter=require("./route/auth");
// const blogsRouter=require("./routes/blog");
const cors=require("cors");

const createDB=require("./config/db");
createDB();

app.use(express.json());      //middleware -> it is a process which is between request and respond
app.use(cors({
    origin: ['http://localhost:5173', 'https://inventory11-xi.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/products",productsRouter)
app.use("/cart",cartRouter)
app.use("/students",studentsRouter)
app.use("/auth",authRouter)

app.get("/test-db", async (req, res) => {
    try {
        const mongoose = require('mongoose');
        console.log('MongoDB connection state:', mongoose.connection.readyState);
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        
        if (mongoose.connection.readyState === 1) {
            res.json({ status: "Database connected", state: mongoose.connection.readyState });
        } else {
            res.status(500).json({ status: "Database not connected", state: mongoose.connection.readyState });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/profile", authmiddleware, (req,res) => {
    res.status(200).json({ message: "Profile",userData:req.userData });
});

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`)
    next();                 //Pass to next middleware/route
})

// app.use("/blogs",blogsRouter)

app.listen(process.env.PORT, () => {
    console.log(`"Server running at http://localhost:3000"${process.env.PORT}`)
});
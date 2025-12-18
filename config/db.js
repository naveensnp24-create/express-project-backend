const mongoose=require("mongoose");

async function connectDB(){
    try{
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL environment variable is not defined');
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected✅");
    }catch(err){
        console.error("MongoDB connection error❌", err.message);
        console.log("Server will continue running. Fix MongoDB Atlas IP whitelist to enable database features.");
    }
}

module.exports=connectDB;
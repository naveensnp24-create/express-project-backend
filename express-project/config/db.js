const mongoose=require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            
        });
        console.log("MongoDB connected✅");
    }catch(err){
        console.error("MongoDB connection error❌", err.message);
        console.log("Please check your MongoDB Atlas IP whitelist settings");
        process.exit(1);
    }
}

module.exports=connectDB;
const express=require("express");
const Student=require("../models/Student");

const router=express.Router();

router.get("/",(req,res)=>{
    router.post("/",async(req,res)=>{
    try{
        const {name,age,roll_no,class:std}=req.body;
        const student=await Student.create({name,age,roll_no,class:std})
        res.status(201).json({message:"Student created successfully"});
    }catch(err){
        res.status(400).json({error:err.message});
    }
    const students=student.find();
    if(students){
        res.status(200).json(students);
    }else{
        res.status(200).json({error:"Students not found"});
    }
});
})
module.exports=router;
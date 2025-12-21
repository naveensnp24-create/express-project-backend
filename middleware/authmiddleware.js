const jwt = require("jsonwebtoken");
const auth = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded)
    req.userData={id:decoded.id,email:decoded.email};
    next();
  }catch(err) {
    res.status(401).json({error:"unauthorized",message:err.message});
  }
}
module.exports = auth;
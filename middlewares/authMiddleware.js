import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(405).json({
            message: "Access Denied. Protected Route"
        })
    }
    try{
        req.user = jwt.verify(token,process.env.JWT_SECRET);
        next();
    }catch(error){
        return res.status(403).json({
            message:`Invalid or Expired Token`
        })
    }
}

export default authMiddleware;
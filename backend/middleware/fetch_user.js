import jwt from 'jsonwebtoken';

const fetch_user=(req,res,next)=>{
    const token=req.header('token');
    if(!token) res.status(401).json({error:"Please authenticate using a valid token"});
    try {
        const data=jwt.verify(token,process.env.JWT_SECRET);
        req.user=data.user;
        next();
        } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})
        res.send(error.message);
    }
}

export default fetch_user;
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = (req , res ,next )=>{
    try{
        const token = req.body.token || req.cookies.token || req.header('Authorization').replace('bearer ', "");

        if(!token){
          return res.status(401).json({
                success : false,
                message : "Token Missing"
            })
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            
            console.log(decode);
            req.user = decode;

        }

        catch(err){
            return res.status(401).json({
                success : false,
                message : "Cannot Decode",
            })
        }

        next();

    }catch(err){
        return res.status(500).json({
            success :false,
            message : "Something wents wrong , while verifying the token"
        })
    }
}


exports.isStudent = (req, res ,next)=>{
    try{
        if(req.user.role != "Student"){
            return res.status(401).json({
                success :false ,
                message : "This is a protected route for admin"
            })
        }
        next();
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Role is not matching"
        })
    }

 
}

exports.isAdmin = (req, res ,next)=>{
    try{
        if(req.user.role != "Admin"){
            return res.status(401).json({
                success :false ,
                message : "This is a protected route for students"
            })
        }
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Role is not matching"
        })
    }


}
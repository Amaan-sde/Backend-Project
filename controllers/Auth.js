const bcrypt = require('bcrypt')

const User = require('../models/User')

const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.signup = async(req ,res)=>{
    try{
    const {name , password , email , role} = req.body;

    const existingUser = await User.findOne({email})

    if(existingUser){
       return res.status(400).json({
            success : false,
            message : "user already exist",

        })
    }

    let hashPassword;

    try{
         hashPassword = await bcrypt.hash(password ,10);
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message : "Erorr in hashing password"
        })
    }

    const user = await User.create({
        name , email , password : hashPassword , role
    })
    return res.status(200).json({
        success : true,
        message : "User Created Successfully"
    })
    }

    catch(error){
        console.error(error);

        return res.status(500).json({
            success : false,
            message : "User Not Created Successfully"
        })
    }
}


exports.login = async (req , res)=>{
    try{
    let {email , password} = req.body;


    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "please fill the form carefully",
        })
    }

    let user = await User.findOne({email})

    if(!user){
      return res.status(401).json({
        success : false,
        message : "User not exist",
      })
    }
    let playload ={
        email : user.email,
        id : user._id,
        role : user.role,
    }


    if(await bcrypt.compare(password , user.password)){
        let token = jwt.sign(playload , 
                            process.env.JWT_SECRET ,{
                            expiresIn : "2h",
                                        })
                                        user = user.toObject();
                                        user.token = token;
                                        user.password = undefined;
                                        const options ={
                                            expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                                            httpOnly : true,
                                        }


                                        res.cookie("token" , token , options).status(200).json({
                                            success : true,
                                            user,
                                            token,
                                            message : "user logged in succesfully"
                                        })
    }

    else{
        return res.status(400).json({
            success : false,
            message : "Password is incorrect",
        })
    }


    }
   
    catch(err){
        console.error(err)
         return res.status(400).json({
                success : false,
                message : "user not found",
            })
    }

}


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
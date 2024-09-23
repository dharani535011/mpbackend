const jwt=require("jsonwebtoken")
const { KEY } = require("./Config")
const Users = require("./Modules/UserModule")
const Verify={
    check:async(req,res,next)=>{
        try {
           const token= req.cookies["authtoken"]
           if(!token){
            return res.send({message:"Please login"})
           }
           const decode=jwt.verify(token,KEY)
           const user=await Users.findById(decode.id,{password:0})
           if(!user){
            return res.send({message:"user not found"})
           }
           req.user=user
           next()
        } catch (error) {
            res.send({message:error.messsge})
        }
    }
}
module.exports=Verify
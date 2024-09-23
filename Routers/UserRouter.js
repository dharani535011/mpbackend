const express=require("express")
const UserController = require("../Controllers/UserControllers")
const Verify = require("../Verify")
const UserRouter=express.Router()

// NORMAL ROUTES
UserRouter.post("/signup",UserController.signup)
UserRouter.post("/login",UserController.login)
UserRouter.post("/forgetpassword",UserController.forgetpassword)
UserRouter.post("/changepass",UserController.changepass)

// RESTRICTED ROUTES

UserRouter.post("/getusers",Verify.check,UserController.getusers)
UserRouter.post("/checkauthen",Verify.check,UserController.checkauthen)
UserRouter.post("/changemember",Verify.check,UserController.member)
UserRouter.post("/paymentfee",Verify.check,UserController.paymentfee)
UserRouter.post("/deleteuser",Verify.check,UserController.deleteuser)
UserRouter.post("/getapp",Verify.check,UserController.getapp)
UserRouter.post("/logout",Verify.check,UserController.logout)
UserRouter.post("/allapp",Verify.check,UserController.allapp)

// EXPORTS
module.exports=UserRouter
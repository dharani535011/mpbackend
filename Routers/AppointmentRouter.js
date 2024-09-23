const express=require("express")
const Verify = require("../Verify")
const AppointmentController = require("../Controllers/AppointmentControllers")
const AppointmentRouter=express.Router()

AppointmentRouter.post("/book",Verify.check,AppointmentController.book)
AppointmentRouter.post("/deleteapp",Verify.check,AppointmentController.deleteapp)
module.exports=AppointmentRouter
const mongoose=require("mongoose")
const appointmentSchema=new mongoose.Schema({
    session:String,
    phoneno:Number,
    mail:String,
    activity:[{type:String}],
    help:String,
    training:String,
    createdAt:{type:Date,default:Date.now}
})
const Appointments=mongoose.model("Appointments",appointmentSchema,"appointments")
module.exports=Appointments
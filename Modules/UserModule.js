const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    city:String,
    otp:{type:String,default:""},
    role:{type:String,default:"user"},
    appointment:[{type:mongoose.Schema.Types.ObjectId,ref:"Appointments"}],
    fees:[{paymentDate: { type: Date },
        processedDate: { type: Date}}],
    phoneno:Number,
    mail:String,
    password:String,
    membership:{type:String,default:"nomember"},
})

const Users=mongoose.model("Users",userSchema,"users")
module.exports=Users
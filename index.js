const express=require("express")
const app=express()
const cookiespaser=require("cookie-parser")
const cors=require("cors")
const mongoose=require("mongoose")
const { MONGO, STRIPE } = require("./Config")
const moment=require("moment")
const UserRouter = require("./Routers/UserRouter")
const AppointmentRouter = require("./Routers/AppointmentRouter")
const stripe=require("stripe")(STRIPE)
// MIDDLEWARE
app.use(cors({
    origin:true,
    credentials:true
}))
app.use(express.json())
app.use(cookiespaser())
app.use("/users",UserRouter)
app.use("/appointments",AppointmentRouter)

// PAYMENT

app.post("/payments",async(req,res)=>{
    const {amount}=req.body
    try {
        const paymentintent=await stripe.paymentIntents.create({
            amount:amount*100,
            currency:"inr"
        })
        res.send({
            clientSecret:paymentintent.client_secret
        })
    } catch (error) {
        res.send({message:error.message})
    }
})

// DATABASE and SERVER
console.log(moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
console.log(new Date().toISOString())

mongoose.connect(MONGO)
.then(()=>{
    console.log("DATABASE CONNECT")
    app.listen(3000,()=>{
        console.log("SERVER CONNECT")
    })
})
.catch((err)=>console.log(err.message))
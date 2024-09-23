require("dotenv").config()
const MONGO=process.env.mongodb
const KEY=process.env.secretkey
const STRIPE=process.env.stripesecret
const PASSWORD=process.env.password



module.exports={
    MONGO,KEY,STRIPE,PASSWORD
}
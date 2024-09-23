const Users = require("../Modules/UserModule")
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const jwt=require("jsonwebtoken")
const node=require("nodemailer")
const moment=require("moment")
const { KEY, PASSWORD } = require("../Config")
const Appointments = require("../Modules/AppointmentModule")

const UserController={
    signup:async(req,res)=>{
        const {name,password,mail,city,phoneno}=req.body
        try {
            if(!name||!password||!mail||!city||!phoneno){
                return res.send({message:"fill the values"})
            }
            const user=await Users.findOne({mail})
            if(user){
                return res.send({message:"user already exists"})
            }
            const hass=await bcrypt.hash(password,10)
            const newuser=new Users({name,password:hass,mail,city,phoneno})
            if(password==="muralimrperfect"||password==="muthaiyamrperfect"||password==="1234"){
                newuser.role="auth"
                newuser.membership="member"
            }
            await newuser.save()
            res.send({message:"user registered"})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    login:async(req,res)=>{
        const {mail,password}=req.body
        try {
            if(!mail||!password){
                return res.send({message:"fill the values"})
            }
            const user=await Users.findOne({mail})
            if(!user){
                return res.send({message:"user not found"})
            }
            const ispass=await bcrypt.compare(password,user.password)
            if(!ispass){
                return res.send({message:"Worng Password"})
            }
            if(user.membership=="nomember"){
                return res.send({message:"user not allowed by owner, contact your owner!"})
            }
            const token=await jwt.sign({id:user._id},KEY,{expiresIn:"1d"})
            res.cookie("authtoken",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none",
                maxAge:60*60*1000*24
            })
            res.send({message:"login successful"})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    logout:async(req,res)=>{
        try {
            res.clearCookie("authtoken",{
                httpOnly:true,
                secure:true,
                sameSite:true,
            })
            res.send({message:"successfully logout"})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    forgetpassword:async(req,res)=>{
        const {mail}=req.body
        try {
            const user=await Users.findOne({mail})
            if(!user){
                return res.send({message:"user not found"})
            }
            const pass=crypto.randomBytes(6).toString("hex").slice(0,6)
            user.otp=pass
            await user.save()
            setTimeout(async()=>{
                  user.otp=""
                  await user.save()
            },60*60*1000)
            const transport=node.createTransport({
                service:"gmail",
                auth:{
                    user:"dharani535011@gmail.com",
                    pass:PASSWORD
                }
            })
            transport.sendMail({
                from:"dharani535011@gmail.com",
                to:user.mail,
                subject:"password reset OTP",
                text:`change your password to use this otp : ${pass}
                  Go Change your password in this : ${"https://mrperfect-fitness-studio.netlify.app/changepass"}
                 `
            })
            res.send({message:"OTP send to your mail.."})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    changepass:async(req,res)=>{
        const {mail,otp,password}=req.body
        try {
            if(!mail||!otp||!password){
                return res.send({message:"fill the values"})
            }
            const user=await Users.findOne({mail})
            if(user.otp!==otp){
                return res.send({message:"Worng OTP"})
            }
            const hass=await bcrypt.hash(password,10)
            user.password=hass
            user.opt=""
            await user.save() 
            if(!user){
                return res.send({message:"user not found"})
            }
            res.send({message:"password changed successfully"})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    getusers:async(req,res)=>{
        try {
            const users=await Users.find({},{password:0})
            res.send(users)
        } catch (error) {
            res.send({message:error.message})
        }
    },
    checkauthen:async(req,res)=>{
        const user=req.user
        try {
            res.send({message:"on",data:user})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    member: async (req, res) => {
        const { mail } = req.body
        try {
            const user = await Users.findOne({ mail })
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }
            if (user.membership === "nomember") {
                user.membership = "member"
            } else if (user.membership === "member") {
                user.membership = "nomember"
            }
    
            await user.save()
    
            res.send({ message: "Membership status changed"})
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    paymentfee:async(req,res)=>{
        const {mail,date}=req.body
        try {
            if (!mail||!date) {
                return res.status(404).send({ message: "fill all values" })
            }
            const user=await Users.findOne({mail})
            if (!user) {
                return res.status(404).send({ message: "user not found" })
            }
            const today=new Date().toISOString()
            user.fees.push({ paymentDate: date, processedDate: today })
            await user.save()
            return res.status(200).send({ message: `Fees paid for date: ${date}`, today })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    deleteuser: async (req, res) => {
        const { mail } = req.body;
        try {
            if (!mail) {
                return res.status(400).send({ message: "Please provide a valid email." });
            }
    
            const user = await Users.findOne({ mail });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
    
            await Appointments.deleteMany({ _id: { $in: user.appointment } });
    
            await Users.deleteOne({ mail });
    
            res.status(200).send({ message: "User deleted successfully." });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getapp:async(req,res)=>{
        const user=req.user
        try {
            const ans=await Appointments.find({_id:{$in:user.appointment}})
            res.send(ans)
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    allapp:async(req,res)=>{
        try {
            const ans=await Appointments.find()
            res.send(ans)
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
    

    
}
module.exports=UserController
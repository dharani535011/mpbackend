const { PASSWORD } = require("../Config")
const Appointments = require("../Modules/AppointmentModule")
const node=require("nodemailer")
const moment=require("moment")
const Users = require("../Modules/UserModule")


const AppointmentController={
    
    book:async(req,res)=>{
        const user=req.user
        const {session,phoneno,mail,activity,help,training}=req.body
        try {
            if(!session||!phoneno||!mail||!activity||!help||!training){
                return res.send({message:"fill all values"})
            }
            const app=new Appointments({session,phoneno,mail,activity,help,training})
            await app.save()
            const use=await Users.findOne({mail:user.mail})
            use.appointment.push(app._id)
            await use.save()
            const transport=node.createTransport({
                service:"gmail",
                auth:{
                    user:"dharani535011@gmail.com",
                    pass:PASSWORD
                }
            })
            transport.sendMail({
                from:"dharani535011@gmail.com",
                to:mail,
                subject:"APPOINTMENT BOOK",
                text:` Your are booked a appointment in Mr.Perfect Fitness studio 
                       Detials:=>
                        Activity         : ${activity}
                        phone No         : ${phoneno}
                        Training         : ${training}
                        Email            : ${mail}
                        Booked Date      : ${moment().calendar()}
                        
                        for more detials call: +91 90477 43533, +91 97159 38778`
            })
            res.send({message:"appointment booked"})
        } catch (error) {
            res.send({message:error.message})
        }
    },
    deleteapp:async(req,res)=>{
        const {id}=req.body
        const user=req.user
        try {
            if(!id){
                return res.send({message:"Appointment not found"})
            }
            await Appointments.deleteOne({_id:id})
            const use=await Users.findOne({mail:user.mail})
            const re=use.appointment.filter(val=>String(val)!==String(id))
            use.appointment=re
            await use.save()
            res.send({message:"Appointment Cancel"})
        } catch (error) {
            res.send({message:error.message})
        }
    }
}
module.exports=AppointmentController
const express = require("express")
const router = express.Router()
const {user} = require("../Schema/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const salt = 10;
const SECRET_KEY="My-Secret-Key"
const app=express()
app.use(express.json())

router.post("/signup", async (req, res) => {
    const data = req.body
    console.log(req.body)
    const existingUser = await user.findOne({ username: data.username });
    if (existingUser) {
        return res.status(409).json({message:"Username already exists"});
        }
        else{
            bcrypt.genSalt(salt, (saltErr, saltVal) => {
            if (saltErr) {
                res.status(401).json({message:"unable to process"})
            }
            else {
                bcrypt.hash(req.body.password, saltVal, (hashErr, hashVal) => {
                    if (hashErr) {
                        console.log(hashErr)
                        res.status(401).json({message:"unable to process"})
                    } 
                    else {
                        user.create({ username: data.username, password: hashVal, age: data.age})
                            .then((user) => {
                                res.status(200).json({ message: "Registration successful" })
                            })
                            .catch((err) => res.status(400).send(err.message))
                    }

                })
            }
        })
        }
    })

    router.post("/signin",async(req,res)=>{
        const data=req.body
        console.log(data)
         user.findOne({username:data.username}).then((user)=>{
            if(!user){
                res.status(401).json("user not exist")
            }
            else{
                if(!bcrypt.compareSync(data.password,user.password)){
                    res.status(401).send("Wrong password")
                }
                else{
                    const token=jwt.sign({id:user._id,username:user.username},SECRET_KEY)
                    res.status(200).json({message:"Login successful",token:token})
                }
            }
         })
    })

module.exports=router
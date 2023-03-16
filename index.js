const express=require("express");
const mongoose = require("mongoose");
const app=express()
const jwt=require("jsonwebtoken")
const bodyparser=require("body-parser")
const PORT=8080
const SECRET_KEY="My-Secret-Key"
const UserRoutes=require("./routes/user")
const offerRoute=require("./routes/offer")
const {user} = require("./Schema/userSchema");
const cors=require("cors")
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb://localhost:27017/user").then(()=>{
    console.log("connected")
})
app.use("/offer", (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        
        if (err)
          return res
            .status(403)
            .json({ message: "Session expired, please login again" });
        req.user = await user.findOne({ _id: decoded.id});
        next();
      });
    } else
      return res
        .status(403)
        .json({ message: "Session expired, please login again" });
  });
  app.use("/user", UserRoutes);
  app.use("/offer", offerRoute);


app.listen(PORT,()=>{
    console.log("App is running on port 8080")
})
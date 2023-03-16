const mongoose=require("mongoose")

const offerSchema=new mongoose.Schema({
        offerid: { type: String },
        offertitle: { type: String },
        offerdesc: { type: String },
        offerimageurl: { type: String },
        offercontent: { type: String },
        offerto: { type: String },
        offerpricecoins: { type: Number },
        offerpricegems: { type: Number },
      },
      { timestamps: true }
)

const offer=mongoose.model("offer",offerSchema)

module.exports=offer
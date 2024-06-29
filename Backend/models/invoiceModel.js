const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var invoiceSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: Number,
    required: true,
  },
  taxRate: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  totalPrice:{
    type:Number,
    required:true
   },
   month:{
    type:String,
    default: () => new Date().getMonth()
    },
  items:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      quantity:{
        type: Number,
        required:true
      },
      price:{
        type: Number,
        required:true
      },
      total:{
        type: Number,
        required:true
      },
    }
   ],  
},
{
  timestamps: true,
}
);

//Export the model
module.exports = mongoose.model("Invoice", invoiceSchema);
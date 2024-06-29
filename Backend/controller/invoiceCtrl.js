const Invoice = require("../models/invoiceModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// Create a new invoice
const createInvoice = asyncHandler(async (req, res) => {
  const newInvoice = await Invoice.create(req.body);
  res.status(201).json(newInvoice);
});

// Update an invoice by ID
const updateInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedInvoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(updatedInvoice);
});

// Delete an invoice by ID
const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const deletedInvoice = await Invoice.findByIdAndDelete(id);

  if (!deletedInvoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(deletedInvoice);
});


// Get all invoices
const getallInvoice = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find();
  res.json(invoices);
});

// Get all invoices and populate the 'user' field
const getAllInvoices = asyncHandler(async (req, res) => {
  try{
    const invoices =await Invoice.find().populate("user")
    res.json({
      invoices
    })

  }catch(error){
    throw new Error(error)
  }
})
const getSingleInvoices  = asyncHandler(async(req,res)=>{
  const {id}=req.params
  try{
    const invoices =await Invoice.findOne({_id:id}).populate("items.product")
    res.json({
      invoices
    })

  }catch(error){
    throw new Error(error)
  }
})

const getMonthInvoiceIncome = asyncHandler(async (req, res) => {
  let d = new Date();
  d.setMonth(d.getMonth() - 11);
  d.setDate(1);
  const startDate = d;

  try {
    const data = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          amount: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    console.log("Monthly Data: ", data); // Log the aggregated data
    res.json(data);
  } catch (error) {
    console.error("Error in getMonthInvoiceIncome: ", error); // Detailed error logging
    res.status(500).send({ message: "Server Error", error });
  }
});

const getYearlyTotalInvoices = asyncHandler(async (req, res) => {
  let d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  const startDate = d;

  try {
    const data = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          amount: { $sum: "$totalPrice" },
        },
      },
    ]);
    console.log("Yearly Data: ", data); // Log the aggregated data
    res.json(data);
  } catch (error) {
    console.error("Error in getYearlyTotalInvoices: ", error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getSingleInvoices,
  getallInvoice,
  getMonthInvoiceIncome,
  getYearlyTotalInvoices,
  getAllInvoices
};

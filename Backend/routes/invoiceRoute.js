const express = require("express");
const {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getallInvoice,
    getMonthInvoiceIncome,
    getYearlyTotalInvoices,
    getSingleInvoices,
    getAllInvoices,
} = require("../controller/invoiceCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createInvoice);
router.put("/:id", authMiddleware, isAdmin, updateInvoice);
router.delete("/:id", authMiddleware, isAdmin, deleteInvoice);
router.get("/getaInvoice/:id", authMiddleware,isAdmin, getSingleInvoices);
router.get("/getMonthInvoiceIncome", authMiddleware, getMonthInvoiceIncome);
router.get("/yearlyinvoice", authMiddleware, getYearlyTotalInvoices);
router.get("/getallinvoices", authMiddleware, isAdmin, getAllInvoices);
router.get("/", getallInvoice);

module.exports = router;
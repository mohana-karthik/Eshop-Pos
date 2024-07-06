import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

const getInvoices = async()=>{
    const response = await axios.get(`${base_url}invoice`);
    return response.data;
};

const createInvoice = async (invoice)=>{
    const response = await axios.post(`${base_url}invoice`,invoice,config);

    return response.data;
};
const updateInvoice = async (invoice)=>{
    const response = await axios.put(`${base_url}invoice/${invoice.id}`,
    {
        clientName:invoice.invoiceData.clientName,
        clientEmail:invoice.invoiceData.clientEmail,
        clientPhone:invoice.invoiceData.clientPhone,
        taxRate:invoice.invoiceData.taxRate,
        paymentMethod:invoice.invoiceData.paymentMethod,
    },config);

    return response.data;
};
const getInvoice = async (id)=>{
    const response = await axios.get(`${base_url}invoice/${id}`,config);
    return response.data;
};

const deleteInvoice = async (id)=>{
    const response = await axios.delete(`${base_url}invoice/${id}`,config);

    return response.data;
};
const getMonthlyInvoices = async () => {
    const response = await axios.get(`${base_url}invoice/getMonthInvoiceIncome`, config);
      return response.data;
};

const getYearlyInvoice = async () => {
    const response = await axios.get(`${base_url}invoice/yearlyinvoice`, config);
      return response.data;
};
const getSingle = async(id)=>{
    const response =await axios.get(`${base_url}invoice/getaInvoice/${id}`,config);

    return response.data;
};
const invoiceService = {
    getInvoices,
    createInvoice,
    getInvoice, 
    updateInvoice,
    deleteInvoice,
    getMonthlyInvoices,
    getYearlyInvoice,
    getSingle,
  };

  export default invoiceService;
  
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices, resetState,deleteAInvoice } from "../features/invoice/invoiceSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "clientName",
    sorter: (a, b) => a.clientName.length - b.clientName.length,
  },
  {
    title: "clientEmail",
    dataIndex: "clientEmail",
  },
  {
    title: "clientPhone",
    dataIndex: "clientPhone",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "paymentMethod",
    dataIndex: "paymentMethod",
  },
  {
    title: "totalPrice",
    dataIndex: "totalPrice",
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];
const Invoicelist = () => {
  const [open, setOpen] = useState(false);
  const [invoiceId, setinvoiceId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setinvoiceId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getInvoices());
  }, []);
  const invoiceState = useSelector((state) => state.invoice.invoices);
  const data1 = [];
  for (let i = 0; i < invoiceState.length; i++) {
    data1.push({
      key: i + 1,
      clientName: invoiceState[i].clientName,
      clientEmail: invoiceState[i].clientEmail,
      clientPhone: invoiceState[i].clientPhone,
      product: (
        <Link to={`/admin/invoice/${invoiceState[i]?._id}`}>
          View Orders
        </Link>
      ),
      paymentMethod: invoiceState[i].paymentMethod,
      totalPrice: invoiceState[i].totalPrice,
      action: (
        <>
          <Link
            to={`/admin/invoice/${invoiceState[i]._id}`}
            className=" fs-3 text-danger"
          >
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0 "
            onClick={() => showModal(invoiceState[i]._id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const deleteInvoice = (e) => {
    dispatch(deleteAInvoice(e));

    setOpen(false);
    setTimeout(() => {
      dispatch(getInvoices());
    }, 100);
  };
  return (
    <div>
      <h3 className="mb-4 title">Invoice</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteInvoice(invoiceId);
        }}
        title="Are you sure you want to delete this invoice?"
      />
    </div>
  );
};

export default Invoicelist;

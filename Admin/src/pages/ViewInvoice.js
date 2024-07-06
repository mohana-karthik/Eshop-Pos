import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getSingle } from "../features/invoice/invoiceSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product",
    dataIndex: "name",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Total",
    dataIndex: "total",
  },
];

const ViewInvoice = () => {
  const location = useLocation();
  const invoiceId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingle(invoiceId));
  }, [dispatch, invoiceId]);

  const invoiceState = useSelector((state) => state.invoice.singleinvoice);

  console.log("invoiceState:", invoiceState);

  const data1 = [];
  if (invoiceState && invoiceState.invoices && invoiceState.invoices.items) {
    for (let i = 0; i < invoiceState.invoices.items.length; i++) {
      data1.push({
        key: i + 1,
        name: invoiceState.invoices.items[i].product.title,
        quantity: invoiceState.invoices.items[i].quantity,
        price: invoiceState.invoices.items[i].price,
        total: invoiceState.invoices.items[i].total,
      });
    }
  }

  console.log("data1:", data1);

  return (
    <div>
      <h3 className="mb-4 title">View Product</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default ViewInvoice;

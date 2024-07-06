import React,{useEffect,useState} from "react";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import {useDispatch,useSelector} from "react-redux";
import { getMonthlyReport, getInvoices, getYearlyReport } from "../features/invoice/invoiceSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "clientName",
  
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
    title: "paymentMethod",
    dataIndex: "paymentMethod",
  },
  {
    title: "totalPrice",
    dataIndex: "totalPrice",
  },
];

const Dashboard = () => {

const dispatch = useDispatch()
const monthlyDataState = useSelector(state=>state?.invoice?.monthlyData)
const yearlyDataState = useSelector(state=>state?.invoice?.yearlyData)
const invoiceState = useSelector(state=>state?.invoice?.invoices)
const [dataMonthly,setDataMonthly]=useState([])
const [dataMonthlySales,setDataMonthlySales]=useState([])
const [orderData,setOrderData] = useState([])
useEffect(()=>{
dispatch(getMonthlyReport())
dispatch(getYearlyReport())
dispatch(getInvoices())
},[])

useEffect (()=>{
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let data=[]
  let monthlyOrderCount=[]
for (let index = 0; index < monthlyDataState?.length; index++) {
  const element = monthlyDataState[index];
  
  data.push({type:monthNames[element?._id?.month],income:element?.amount})
  monthlyOrderCount.push({type:monthNames[element?._id?.month],sales:element?.count})
}
setDataMonthly(data)
setDataMonthlySales(monthlyOrderCount)

const data1 = [];
for (let i = 0; i < invoiceState?.length; i++) {
  data1.push({
    key: i,
    clientName: invoiceState[i].clientName,
    clientEmail: invoiceState[i].clientEmail,
    clientPhone: invoiceState[i].clientPhone,
    paymentMethod: invoiceState[i].paymentMethod,
    totalPrice: invoiceState[i].totalPrice,
  });
}

setOrderData(data1)

},[monthlyDataState,yearlyDataState])

const config = {
  data:dataMonthly,
  xField: "type",
  yField: "income",
  color: ({ type }) => {
    return "#090979";
  },
  label: {
    position: "middle",
    style: {
      fill: "#FFFFFF",
      opacity: 1,
    },
  },
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
  meta: {
    type: {
      alias: "Month",
    },
    sales: {
      alias: "Sales",
    },
  },
};
  const config2 = {
    data:dataMonthlySales,
    xField: "type",
    yField: "sales",
    color: ({ type }) => {
      return "#090979";
    },
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: "Month",
      },
      sales: {
        alias: "Sales",
      },
    },
  };
  return (
    <div>
      <h3 className="mb-4 title"> Invoice Dashboard</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Total Income</p>
            {<h4 className="mb-0 sub-title">Rs{yearlyDataState && yearlyDataState[0]?.amount}</h4>}
          </div>
          <div className="d-flex flex-column align-items-end">
            
            <p className="mb-0 desc">Income in Last Year from Today </p>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Total Sales</p>
            <h4 className="mb-0 sub-title">{yearlyDataState && yearlyDataState[0]?.count}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
             
            <p className="mb-0 desc">Sales in Last Year from Today</p>
          </div>
        </div>
       
      </div>
      <div className="d-flex justify-content-between gap-3">
      <div className="mt-4 flex-grow-1 w-50">
        <h3 className="mb-5 title">Income Statics</h3>
        <div>
          <Column {...config} />
        </div>
      </div>
      <div className="mt-4 flex-grow-1 w-50">
        <h3 className="mb-5 title">Sales Statics</h3>
        <div>
          <Column {...config2} />
        </div>
      </div>

      </div>
      <div className="mt-4">
        <h3 className="mb-5  title">Recent Orders</h3>
        <div>
          <Table columns={columns} dataSource={orderData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

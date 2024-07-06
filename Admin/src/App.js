import './App.css';
import {BrowserRouter as Router,  Routes, Route} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Colorlist from './pages/Colorlist';
import Categorylist from './pages/Categorylist';
import Brandlist from './pages/Brandlist';
import Productlist from './pages/Productlist';
import Addcolor from './pages/Addcolor';
import Addcat from './pages/Addcat';
import Addbrand from './pages/Addbrand';
import Addproduct from './pages/Addproduct';
import Enquiries from './pages/Enquiries';
import Couponlist from './pages/Couponlist';
import Addcoupon from './pages/Addcoupon';
import ViewEnq from './pages/ViewEnq';
import ViewOrder from './pages/ViewOrder';
import ViewInvoice from './pages/ViewInvoice'
import Invoice from './pages/Invoice';
import Invoicelist from './pages/Invoicelist';
import Report from './pages/Report';
import { OpenRoutes } from './routing/OpenRoutes';
import { PrivateRoutes } from './routing/PrivateRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpenRoutes><Login /></OpenRoutes>} />
        <Route path="/admin" element={<PrivateRoutes><MainLayout /></PrivateRoutes>} >
          <Route index element={<Dashboard />}/>
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="list-color" element={<Colorlist />} />
          <Route path="color" element={<Addcolor />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="list-category" element={<Categorylist />} />
          <Route path="category" element={<Addcat />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path="list-brand" element={<Brandlist />} />
          <Route path="brand" element={<Addbrand />} />
          <Route path="brand/:id" element={<Addbrand />} />
          <Route path="list-product" element={<Productlist />} />
          <Route path="product" element={< Addproduct />} />
          <Route path="enquiries" element={< Enquiries />} />
          <Route path="enquiries/:id" element={< ViewEnq />} />
          <Route path="coupon-list" element={< Couponlist/>} />
          <Route path="coupon" element={< Addcoupon/>} />
          <Route path="coupon/:id" element={< Addcoupon/>} />
          <Route path="invoice" element={< Invoice/>} />
          <Route path="invoice-list" element={< Invoicelist/>} />
          <Route path="invoice/:id" element={<ViewInvoice />} />
          <Route path="report" element={< Report/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

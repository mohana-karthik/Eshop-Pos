import React, { useState,useEffect } from "react";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineBgColors,
  AiOutlineLogout
} from "react-icons/ai";
import { ToastContainer} from 'react-toastify';
import { useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa";
import { RiCouponLine } from "react-icons/ri";
import { ImBlog } from "react-icons/im";
import { FaMoneyBills } from "react-icons/fa6";
import { MenuFoldOutlined, MenuUnfoldOutlined,UserOutlined,CopyOutlined,ShoppingCartOutlined } from "@ant-design/icons";
import { Layout, Menu ,theme  } from "antd";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="sm-logo">POS</span>
            <span className="lg-logo">E-shop</span>
          </h2>
        </div>
        <Menu 
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
              localStorage.clear()
              window.location.reload()
             
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Dashboard",
            },
            {
              key: "Catalog",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Catalog",
              children: [
                {
                  key: "product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Add Product",
                },
                {
                  key: "list-product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Product List",
                },
                {
                  key: "brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand",
                },
                {
                  key: "list-brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Brand List ",
                },
                {
                  key: "category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category",
                },
                {
                  key: "list-category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Category List",
                },
                {
                  key: "color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Size",
                },
                {
                  key: "list-color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Size List",
                },
              ],
            },
            {
              key: "orders",
              icon: <FaClipboardList className="fs-4" />,
              label: "Orders",
            },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Marketing",
              children: [
                {
                  key: "coupon",
                  icon: <ImBlog className="fs-4" />,
                  label: "Add Coupon",
                },
                {
                  key: "coupon-list",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Coupon List",
                },
              ],
            },
           
            {
              key: "home",
              icon: <FaMoneyBills className="fs-4" />,
              label: "Customer",
              children: [
                {
                  key: "enquiries",
                  icon: <CopyOutlined className="fs-4" />,
                  label: "Enquiries",
                },
                {
                  key: "customers",
                  icon: <UserOutlined className="fs-4" />,
                  label: "Custemer",
                },
               
              ],
            },
            {
              key: "pos",
              icon: <FaMoneyBills className="fs-4" />,
              label: "POS",
              children: [
                {
                  key: "report",
                  icon: <CopyOutlined className="fs-4" />,
                  label: "Dashboard",
                },
                {
                  key: "invoice",
                  icon: <UserOutlined className="fs-4" />,
                  label: "Billing",
                },
                {
                  key: "invoice-list",
                  icon: <UserOutlined className="fs-4" />,
                  label: "Billing-list",
                },
               
              ],
            },
            {
              key:"signout",
              icon:<AiOutlineLogout className="fs-4"/>,
              label:"Sign out"
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
           
            <div className="d-flex gap-3 align-items-center dropdown">
              
              <div 
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false">
                <h5 className="mb-0"> </h5>
                <p className="mb-0"></p>
              </div>
    
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
           <ToastContainer
           position="top-right"
           autoClose={250}
           hideProgressBar={false}
           newestOnTop={true}
           closeOnClick
           rtl={false}
           pauseOnFocusLoss
           draggable
           theme="dark" />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;

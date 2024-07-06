import React, { useEffect } from "react";
import CustomInput from "../components/CustomInput";
import {useNavigate} from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { toast } from "react-toastify";

let schema = Yup.object().shape({
  email: Yup.string()
    .email("Email Should Be Valid")
    .required("Email is Required"),
  password: Yup.string().required("Password is Required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });
  const authState = useSelector((state)=>state);
  const { user,  isError, isSuccess, isLoading } = authState.auth;
  
  useEffect(() => {
    if(isSuccess && user){
      toast.success("Welcome Admin");
      navigate("admin");
    }
    if (isError) {
      toast.error("You are not an Admin!");
    }
  },[user, isError, isSuccess, isLoading]);
  return (
    <>
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
            <img src="https://c2n.in/wp-content/uploads/2018/05/Yellow-Grey-and-Purple-3D-Elements-Student-Part-Time-Volunteer-Video-Resume-Talking-Presentation-6-1536x864.jpg" alt="Login" height={550} width={550}/>
        </div>
        <form action="" onSubmit={formik.handleSubmit} className="login-form">
           <p className="form-title">Welcome back</p>
           <p>Login to the Admin  Dashboard</p>
       
          <CustomInput
            type="text"
            name="email"
            label="Email Address"
            id="email"
            val={formik.values.email}
            onCh={formik.handleChange("email")}
          />
          <div className="error">
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
          </div>
          <CustomInput
            type="password"
            name="password"
            label="Password"
            id="pass"
            val={formik.values.password}
            onCh={formik.handleChange("password")}
          />
          <div className="error">
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}
          </div>
    
          <button
            className="border-0 px-3 mt-3 py-2 text-white fw-bold w-100 text-center text-decoration-none"
            style={{
              background: "rgb(2,0,36)",
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 39%, rgba(0,212,255,1) 82%)",
            }}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;

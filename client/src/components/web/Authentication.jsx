import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Authentication() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    userNameOrEmail: "",
    email: "",
    userName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const navigaterote = window.location.pathname.includes("/admin")
    ? "/admin"
    : "/";

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePhoneKeyDown = (e) => {
    if (e.key.length === 1 && !/^\d$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }

    if (formData.phone.length >= 10 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp != true) {
      if (!formData.userNameOrEmail.trim() || !formData.password.trim()) {
        toast.warning("Please fill all fields.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }

      try {
        const response = await axios.post(
          `${window.react_app_url}auth/sign-in/${
            navigaterote === "/admin" ? "admin" : "user"
          }`,
          formData,
          { withCredentials: true }
        );

        if (!response.data.status) {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          navigate(navigaterote, { replace: true });
        }
      } catch (error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      //   startLoading();

      if (
        !formData.userName.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim() ||
        !formData.password.trim() ||
        !formData.confirmPassword.trim()
      ) {
        toast.warning("Please fill in all required fields.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // stopLoading();
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.warning("Please enter a valid email address.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // stopLoading();
        return;
      }

      if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
        toast.warning("Please enter a valid 10-digit phone number.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // stopLoading();
        return;
      }

      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(formData.password)) {
        toast.warning(
          "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          }
        );
        // stopLoading();
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.warning("Passwords do not match.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        // stopLoading();
        return;
      }

      try {
        const response = await axios.post(
          `${window.react_app_url}auth/sign-up`,
          formData,
          { withCredentials: true }
        );
        if (!response.data.status) {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          navigate("/");
        }
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } finally {
        // stopLoading();
      }
    }
  };

  return (
    <>
      <link rel="stylesheet" href="css/login.css"></link>
      <div>
        <br />
        <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
          <div className="form sign-in">
            <h2>Welcome to BlueBird</h2>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="userNameOrEmail"
                value={formData.userNameOrEmail}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </label>
            {/* <p className="forgot-pass">
              <NavLink to="/forgot-password">Forgot password?</NavLink>
            </p> */}
            <button type="button" className="submit" onClick={handleSubmit}>
              Sign In
            </button>
          </div>
          <div className="sub-cont">
            <div className="img">
              <div className="img__text m--up">
                <div className="auth_page_logo">
                  <img src="images/menu/logo/logo.png" alt="" />
                </div>
                <h3>
                  Don't have an account?
                  <br></br>Please Sign up!
                </h3>
              </div>
              <div className="img__text m--in">
                <div className="auth_page_logo">
                  <img src="images/menu/logo/logo.png" alt="" />
                </div>
                <h3>If you already have an account, just sign in.</h3>
              </div>
              <div className="img__btn" onClick={handleToggle}>
                <span className="m--up">
                  <b>Sign Up</b>
                </span>
                <span className="m--in">
                  <b>Sign In</b>
                </span>
              </div>
              <NavLink to="/">
                <div className="img__btn back_btn">
                  <span>
                    <b>Back To Home</b>
                  </span>
                </div>
              </NavLink>
            </div>
            <div className="form sign-up">
              <h2>Create your Account</h2>
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onKeyDown={handlePhoneKeyDown}
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span onClick={togglePasswordVisibility}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </label>
              <label>
                <span>Confirm Password</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </label>
              <button type="button" className="submit" onClick={handleSubmit}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Authentication;

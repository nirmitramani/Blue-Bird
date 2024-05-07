import React, { useState, useEffect, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IDContext } from './hooks/IDContext';

const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
      setValue(e.target.value);
    };
  
    const handleFocus = () => {
      if (value === initialValue) {
        setValue("");
      }
    };
  
    const handleBlur = () => {
      if (value === "") {
        setValue(initialValue);
      }
    };
  
    return {
      value,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
    };
  };

const Footer = () => {
    const emailInput = useFormInput("Enter your e-mail");
  const { updateGender } = useContext(IDContext);
  return (
    <div className="footer">
      <div className="footer-full">
        <div className="footer-static-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6">
                <div className="footer-block first-child">
                  <h4>About Us</h4>
                  <p className="footer-desc">
                  "Unlock Your Style Potential with Bluebird: 
                  Where Fashion Meets Comfort and Quality in Every Thread."
                  </p>
                  <ul className="footer-contact">
                    <li className="address add">
                      <i className="fa fa-map-marker"></i>Nikol Road, Ahmedabad, Gujarat. 382350
                    </li>
                    <li className="phone add">
                      <i className="fa fa-phone"></i>
                      <a href="javascript:void(0)">+91 9313556651</a>
                    </li>
                    <li className="email add">
                      <i className="fa fa-envelope-o"></i>
                      <a href="mailto://bbird3694@gmail.com">
                      bbird3694@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-2 col-md-5 col-sm-6">
                <div className="footer-block second-child">
                  <h4>My Account</h4>
                  <ul>
                    <li>
                      <NavLink to="profile">My account</NavLink>
                    </li>
                    <li>
                      <NavLink to="wishlist">Wishlist</NavLink>
                    </li>
                    <li>
                      <NavLink to="/checkout">Checkout</NavLink>
                    </li>
                    <li>
                      <NavLink to="order">My orders</NavLink>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-2 col-md-3 col-sm-6">
                <div className="footer-block">
                  <h4>Information</h4>
                  <ul>
                    <li>
                      <NavLink to="/shop">Shop</NavLink>
                    </li>
                    <li>
                      <NavLink to="/faq">FAQs</NavLink>
                    </li>
                    <li>
                      <NavLink to="/contact-us">Contact us</NavLink>
                    </li>
                    <li>
                      <NavLink to="/about-us">About us</NavLink>
                    </li>

                    <li>
                      <NavLink to="/portfolio">Portfolio</NavLink>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-sm-6">
                <div className="footer-block">
                  <h4>Categories</h4>
                  <ul>
                    <li>
                      <NavLink to="/shop" onClick={() => updateGender("male")}>Male</NavLink>
                    </li>
                    <li>
                      <NavLink to="/shop" onClick={() => updateGender("female")}>Female</NavLink>
                    </li>
                    <li>
                      <NavLink to="/shop" onClick={() => updateGender("kids")}>Kids</NavLink>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-3 col-md-8 col-sm-12">
                <div className="newsletter-block-left">
                  <h4>Sign up to newsletter</h4>
                  <form action="#">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={emailInput.value}
                        onChange={emailInput.onChange}
                        onFocus={emailInput.onFocus}
                        onBlur={emailInput.onBlur}
                      />
                      <button
                        className="btn btn-default button button-small"
                        type="submit"
                        name="submitNewsletter"
                      >
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="social-block">
                  <h4>Follow Us</h4>
                  <ul>
                    <li className="facebook">
                      <a
                        className="_blank"
                        data-bs-toggle="tooltip"
                        href="https://www.facebook.com/"
                        title="Facebook"
                        target="_blank"
                      >
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li className="twetter">
                      <a
                        className="_blank"
                        data-bs-toggle="tooltip"
                        href="https://www.twitter.com/"
                        title="Twetter"
                        target="_blank"
                      >
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li className="rss">
                      <a
                        className="_blank"
                        data-bs-toggle="tooltip"
                        href="https://www.rss.com/"
                        title="RSS"
                        target="_blank"
                      >
                        <i className="fa fa-rss"></i>
                      </a>
                    </li>
                    <li className="youtube">
                      <a
                        className="_blank"
                        data-bs-toggle="tooltip"
                        href="https://www.youtube.com/"
                        title="Youtube"
                        target="_blank"
                      >
                        <i className="fa fa-youtube"></i>
                      </a>
                    </li>
                    <li className="google-plus">
                      <a
                        className="_blank"
                        data-bs-toggle="tooltip"
                        href="https://www.plus.google.com/discover"
                        title="Google Plus"
                        target="_blank"
                      >
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-static-bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="copyright">
                  <span>
                    Copyright &copy; 2024 <NavLink to="/">Bluebird.</NavLink> All rights
                    reserved.
                  </span>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="payment f-right">
                  <a href="#">
                    <img src="images/payment/1.png" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;

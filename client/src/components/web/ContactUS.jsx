import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import $ from "jquery";

const ContactUS = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var formMessages = $(".form-messege");
    try {
      const response = await axios.post(
        `${window.react_app_url + window.contact_url}`,
        formData
      );
      console.log("Data sent successfully:", response.data);

      if (response.data.status == true) {
        $(formMessages).removeClass("error");
        $(formMessages).addClass("success");
        $(formMessages).text(response.data.message);
        $("#contact-form input,#contact-form textarea").val("");
      } else {
        $(formMessages).removeClass("success");
        $(formMessages).addClass("error");
        $(formMessages).text(
          "Oops! An error occured and your message could not be sent."
        );
      }
    } catch (error) {
      console.error("Error sending data:", error);
      $(formMessages).removeClass("success");
      $(formMessages).addClass("error");
      $(formMessages).text(error.response.data.message);
    }
  };

  return (
    <>
      <div className="page-banner contact-us-page-banner">
        <div className="container-fluid pl-60 pr-60">
          <div className="page-banner-content">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="active">
                <NavLink to="/contact-us">Contact Us</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="contact-area">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-md-12 col-lg-6">
              <div className="contact-form-wrap">
                <h2 className="contact-title">TELL US YOUR PROJECT</h2>
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="contact-form-style mb-3">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name*"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-form-style mb-3">
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email*"
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="contact-form-style mb-3">
                        <input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Subject"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="contact-form-style">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Type your message here.."
                        ></textarea>
                        <button className="form-button" type="submit">
                          <span>Send Email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="form-messege mt-3"></p>
                </form>
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <div className="raavin-address">
                <h2 className="contact-title">CONTACT US</h2>
                <p>
                  Get in touch with us effortlessly! Whether you have queries
                  regarding our products, need assistance with an order, or
                  simply want to share feedback, we're here to assist you every
                  step of the way. Our dedicated customer service team is
                  committed to providing prompt and personalized support,
                  ensuring your experience with us is seamless. Reach out via
                  phone, email, or live chat – we're eager to hear from you!
                </p>
                <ul>
                  <li>
                    <i className="fa fa-fax"></i> Address : Nikol Road, Ahmedabad, Gujarat. 382350
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> +91 9313556651
                  </li>
                  <li>
                    <i className="fa fa-envelope-o"></i> bbird3694@gmail.com
                  </li>
                </ul>
                <div className="working-time">
                  <h3>
                    <strong>Working hours</strong>
                  </h3>
                  <p>
                    <strong>Monday – Saturday</strong>: &nbsp;08AM – 22PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUS;

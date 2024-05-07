import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.faq_url}`)
      .then((response) => {
        setFaqs(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  }, []);

  return (
    <>
      <div className="page-banner mb-20">
        <div className="container-fluid pl-60 pr-60">
          <div className="page-banner-content">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="active">
                <NavLink to="/faq">FAQ</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="frequently-area pb-90">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="frequently-content">
                <div className="frequently-desc">
                  <h3>
                  Welcome to our FAQs page
                  </h3>
                  <p>
                    where you can find answers to commonly asked questions about
                    our products and services. Whether you're wondering about
                    shoe sizing, materials, care instructions, or our return
                    policy, you'll likely find the information you need right
                    here. We've compiled a list of frequently asked questions to
                    help make your shopping experience with us as smooth and
                    enjoyable as possible. <br/>
                    Feel free to browse through the
                    questions below to find the answers you're looking for. If
                    you can't find what you need, don't hesitate to reach out to
                    our customer service team for further assistance. We're here
                    to help you every step of the way.<br/>
                     Happy shopping!
                  </p>
                </div>
              </div>

              <div className="frequently-accordion">
                <div id="accordion">
                  {faqs && faqs.length > 0 ? (
                    faqs.map((faq, index) => (
                      <div className="card" key={index}>
                        <div className="card-header" id={`heading${index}`}>
                          <h5 className="mb-0"> 
                            <a
                              className="collapsed"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${index}`}
                              aria-expanded="false"
                              aria-controls={`collapse${index}`}
                            >
                              {faq.question}
                            </a>
                          </h5>
                        </div>
                        <div
                          id={`collapse${index}`}
                          className="collapse"
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#accordion"
                        >
                          <div className="card-body">{faq.answer}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No FAQs available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;

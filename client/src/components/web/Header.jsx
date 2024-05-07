import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cart-items");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const logout = () => {
    removeCookie("user");
    toast.success("logout Succesfully.", {
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
  };
  return (
    <>
      {cookies.user ? null : (
        <div className="popup_wrapper">
          <div className="test">
            <span className="popup_off">Close</span>
            <div className="subscribe_area text-center mt-4">
              <h2>Newsletter</h2>
              <p>
                Subscribe to the Makali mailing list to receive updates on new
                arrivals, special offers and other discount information.
              </p>
              <div className="subscribe-form-group">
                <form action="#">
                  <input
                    autoComplete="off"
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Enter your email address"
                  />
                  <button type="submit">subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <header>
        <div className="main-header stick header-sticky">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-2 col-md-3 col-2">
                <div className="logo w-29 ml-7 ">
                  <NavLink to="/">
                    <img src="images/menu/logo/logo.png" alt="" />
                  </NavLink>
                </div>
              </div>

              <div className="col-lg-6 d-none d-lg-block d-xl-block ">
                <div className="main-menu">
                  <nav>
                    <ul>
                      <li className={location.pathname === "/" ? "active" : ""}>
                        <NavLink exact to="/">
                          Home
                        </NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/shop") ? "active" : ""
                        }
                      >
                        <NavLink to="/shop">Shop</NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/faq") ? "active" : ""
                        }
                      >
                        <NavLink to="/faq">FAQs</NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/about-us")
                            ? "active"
                            : ""
                        }
                      >
                        <NavLink to="about-us">About Us</NavLink>
                      </li>
                      {/* <li
                        className={
                          location.pathname.startsWith("/portfolio")
                            ? "active"
                            : ""
                        }
                      >
                        <NavLink to="/portfolio">Portfolio</NavLink>
                      </li> */}
                      <li
                        className={
                          location.pathname.startsWith("/contact-us")
                            ? "active"
                            : ""
                        }
                      >
                        <NavLink to="/contact-us">Contact Us</NavLink>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="col-lg-4 col-md-9 col-10">
                <div className="header-right">
                  <div className="main-menu primary-menu">
                    <nav>
                      <ul>
                        <li>
                          <NavLink to="/cart">
                            <i className="fa fa-shopping-bag"></i>Cart{" "}
                            <span>({cartItems.length})</span>
                          </NavLink>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  <div className="main-menu primary-menu">
                    <nav>
                      <ul>
                        <li>
                          <NavLink exact to="/wishlist">
                            <i className="fa fa-heart"></i>My Wishlist
                          </NavLink>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  <div className="main-menu primary-menu">
                    <nav>
                      <ul>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-cog"></i>Setting
                          </a>
                          <ul className="dropdown primary-dropdown">
                            <li
                              className={
                                location.pathname.startsWith("/profile")
                                  ? "active"
                                  : ""
                              }
                            >
                              <NavLink exact to="/profile">
                                <i className="fa fa-user"></i>My Account
                              </NavLink>
                            </li>
                            <li
                              className={
                                location.pathname.startsWith("/order")
                                  ? "active"
                                  : ""
                              }
                            >
                              <NavLink exact to="/order">
                                <i className="fa fa-shopping-bag"></i>Orders
                              </NavLink>
                            </li>
                            <li
                              className={
                                location.pathname.startsWith("/checkout")
                                  ? "active"
                                  : ""
                              }
                            >
                              <NavLink exact to="/checkout">
                                <i className="fa fa-check-square"></i>Checkout
                              </NavLink>
                            </li>
                            <li
                              className={
                                location.pathname.startsWith("/authentication")
                                  ? "active"
                                  : ""
                              }
                            >
                              {cookies.user ? (
                                <NavLink onClick={logout}>
                                  <i className="fa fa-lock"></i>logout
                                </NavLink>
                              ) : (
                                <NavLink to="/authentication">
                                  <i className="fa fa-unlock"></i>Login
                                </NavLink>
                              )}
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="mobile-menu-area d-lg-none d-xl-none col-12">
                <div className="mobile-menu">
                  <nav>
                    <ul>
                      <li className={location.pathname === "/" ? "active" : ""}>
                        <NavLink exact to="/">
                          Home
                        </NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/shop") ? "active" : ""
                        }
                      >
                        <NavLink to="/shop">Shop</NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/faq") ? "active" : ""
                        }
                      >
                        <NavLink to="/faq">FAQs</NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/about-us")
                            ? "active"
                            : ""
                        }
                      >
                        <NavLink to="about-us">About Us</NavLink>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/portfolio")
                            ? "active"
                            : ""
                        }
                      >
                        <NavLink to="/portfolio">Portfolio</NavLink>
                        <ul className="dropdown">
                          <li>
                            <NavLink to="/portfolio-colums-3">
                              Portfolio Columns 3
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                      <li
                        className={
                          location.pathname.startsWith("/contact-us")
                            ? "active"
                            : ""
                        }
                      >
                        <NavLink to="/contact-us">Contact Us</NavLink>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default Header;

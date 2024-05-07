import "./App.css";
import React, {useEffect} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/web/Header.jsx";
import Footer from "./components/web/Footer.jsx";
import Hero from "./components/web/Hero.jsx";
import Shop from "./components/web/Shop.jsx";
import ContactUS from "./components/web/ContactUS.jsx";
import ProductDetail from "./components/web/ProductDetail.jsx";
import FAQs from "./components/web/FAQs.jsx";
import Wishlist from "./components/web/Wishlist.jsx";
import AboutUS from "./components/web/AboutUS.jsx";
import Portfolio from "./components/web/Portfolio.jsx";
import Checkout from "./components/web/Checkout.jsx";
import Cart from "./components/web/Cart.jsx";
import Order from "./components/web/Order.jsx";
import Profile from "./components/web/Profile.jsx";
import Authentication from "./components/web/Authentication.jsx";
import P404 from "./components/web/P404.jsx";

import AdminHero from "./components/Admin/home/AdminHero";
// Auth imports
import { Auth, AuthGuard } from "./components/Auth";
import { IDProvider } from "./components/web/hooks/IDContext";

// Toasts imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

window.react_app_url = "http://localhost:4000/";
window.contact_url = "contact-us";
window.cms_page_url = "cms-pages";
window.sale_url = "sale";
window.faq_url = "faqs";
window.product_category_url = "productCategory";
window.product_url = "product";
window.slider_url = "slider";
window.user_url = "user";
window.order_url = "order";
window.genrate_orderid_url = "order/genrate-orderid";
window.veryfy_payment_url = "order/verify-payment";
window.order_item_url = "order-item";
window.payment_detail_url = "payment-detail";
window.coupon_code_url = "coupon-code";
window.validate_coupon_code_url = "coupon-code/validate-code";
window.product_stock_size = "product-stock-size";
window.product_stock_size_by_product_id = "product-stock-size/size-by-product";
window.review_url = "review";

function App() {
  const location = useLocation();
  const dontShowNavbarPaths = ["/authentication", "/admin*"];
  const shouldShowNavbar = dontShowNavbarPaths.includes(location.pathname);
  const inAdminPanel = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <IDProvider>
      <>
        <ToastContainer />
        {inAdminPanel && <AdminHero />}
        {!shouldShowNavbar && !inAdminPanel && <Header />}
        <Routes>
          <Route index element={<Hero />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact-us" element={<ContactUS />} />
          <Route path="/product-details" element={<ProductDetail />} />
          <Route path="/faq" element={<FAQs />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about-us" element={<AboutUS />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route
            path="/checkout"
            element={<Auth element={<Checkout />} role="user" />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/order"
            element={<Auth element={<Order />} role="user" />}
          />
          <Route
            path="/profile"
            element={<Auth element={<Profile />} role="user" />}
          />
          <Route
            path="/authentication"
            element={<AuthGuard element={<Authentication />} role="user" />}
          />
          {!inAdminPanel && <Route path="*" element={<P404 />} />}
        </Routes>
        {!shouldShowNavbar && !inAdminPanel && <Footer />}
      </>
    </IDProvider>
  );
}

export default App;

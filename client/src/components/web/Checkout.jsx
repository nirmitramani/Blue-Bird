import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

const Checkout = () => {
  const [formData, setFormData] = useState({
    id: "",
    userName: "",
    email: "",
    phone: "",
    country: "India",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
  });
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);
  const [cartItemsIds, setCartItemsIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const fetchUserData = async () => {
    const response = await axios.get(
      `${window.react_app_url + window.user_url}/bytoken/${cookies.user}`
    );

    if (response.data.status == true) {
      const userData = response.data.data;

      // Populate the form fields with the user's data
      setFormData({
        id: userData?._id || "",
        userName: userData?.userName || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        country: userData?.country || "India",
        address: userData?.address || "",
        city: userData?.city || "",
        state: userData?.state || "",
        postcode: userData?.postcode || "",
      });
    } else {
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
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cart-items");
    if (storedCartItems) {
      setCartItemsIds(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.product_url}`)
      .then((result) => {
        const allProducts = result.data.data;

        const productsWithQuantities = cartItemsIds.map((item) => {
          const product = allProducts.find((p) => p._id === item.productId);
          if (product) {
            return { ...product, quantity: item.quantity, size: item.size };
          }
          return null;
        });

        const filteredCartItemProducts = productsWithQuantities.filter(
          (product) => product
        );

        updateSubtotal(filteredCartItemProducts);
        setCartItems(filteredCartItemProducts);
      })
      .catch((err) => console.log(err));
  }, [cartItemsIds]);

  const updateSubtotal = (items) => {
    const subtotalAmount = items.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    setSubtotal(subtotalAmount);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${
          window.react_app_url + window.validate_coupon_code_url
        }/${couponCode}`
      );

      const couponDetails = response.data.data;
      if (response.data.status === true) {
        setCouponDiscount(couponDetails.discount);
        toast.success("Coupon applied successfully", {
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
        toast.error("Coupon Code not applicable", {
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
    } catch (error) {
      toast.error("Coupon Code not applicable", {
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
  };

  const paymentHandler = async (e) => {
    const emptyFields = Object.values(formData).filter(
      (value) => value.trim() === ""
    );
    if (emptyFields.length > 0) {
      toast.error("Please fill in all the required fields", {
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

    const OrderData = {
      amount: parseInt((subtotal - couponDiscount) * 100),
      currency: "INR",
    };

    const response = await axios.post(
      `${window.react_app_url + window.genrate_orderid_url}`,
      OrderData
    );

    const order = response.data.order;

    var options = {
      key: "rzp_test_50uVL4bi6jWVM7",
      amount: parseInt(order.amount),
      currency: order.currency,
      name: "BlueBird",
      description: "Buy a Shoes.",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: async function (response) {
        const orderData = {
          userToken: cookies.user,
          couponId: couponCode,
          discountAmount: couponDiscount,
          orderDate: new Date(),
          paymentType: "Online",
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            size: item.size,
          })),
          totalAmount: subtotal - couponDiscount,
          onlineOrderId: response.razorpay_order_id,
          onlinPaymentId: response.razorpay_payment_id,
          paymentStatus: "Paid",
          ...formData,
        };

        try {
          const response = await axios.post(
            `${window.react_app_url + window.order_url}`,
            orderData
          );
          if (response.data.status == true) {
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
            localStorage.removeItem("cart-items");
            navigate("/");
          } else {
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
        }
      },
      prefill: {
        name: formData.userName,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
    e.preventDefault();
  };

  const handlePlaceOrder = async () => {
    const emptyFields = Object.values(formData).filter(
      (value) => value.trim() === ""
    );
    if (emptyFields.length > 0) {
      toast.error("Please fill in all the required fields", {
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

    const orderData = {
      userToken: cookies.user,
      couponId: couponCode,
      discountAmount: couponDiscount,
      orderDate: new Date(),
      paymentType: "COD",
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        size: item.size,
      })),
      totalAmount: subtotal - couponDiscount,
      onlinPaymentId: "",
      onlineOrderId: "",
      paymentStatus: "Pending",
      ...formData,
    };

    try {
      const response = await axios.post(
        `${window.react_app_url + window.order_url}`,
        orderData
      );
      if (response.data.status == true) {
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
        localStorage.removeItem("cart-items");
        navigate("/");
      } else {
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
    }
  };

  return (
    <div className="checkout-area pt-100 pb-70">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="coupon-accordion coupon-checkout-div">
              <h3>Have a coupon?</h3>
              <div id="checkout_coupon" className="coupon-checkout-content">
                <div className="coupon-info">
                  <form onSubmit={handleApplyCoupon}>
                    <p className="checkout-coupon">
                      <input
                        placeholder="Coupon code"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <input value="Apply Coupon" type="submit"></input>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-12">
            <form>
              <div className="checkbox-form">
                <h3>Billing Details</h3>
                <div className="row">
                  <div className="col-md-12">
                    <div className="country-select clearfix">
                      <label>
                        Country <span className="required">*</span>
                      </label>
                      <select
                        className="nice-select wide"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option data-display="Bangladesh">Bangladesh</option>
                        <option value="India">India</option>
                        <option value="French">French</option>
                        <option value="Germany">Germany</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="checkout-form-list">
                      <label>
                        Address <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="checkout-form-list">
                      <label>
                        Town / City <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="checkout-form-list">
                      <label>
                        State <span className="required">*</span>
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="checkout-form-list">
                      <label>
                        Postcode / Zip <span className="required">*</span>
                      </label>
                      <input
                        placeholder=""
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-6 col-12">
            <div className="your-order">
              <h3>Your order</h3>
              <div className="your-order-table table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="cart-product-name">Product</th>
                      <th className="cart-product-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((product) => (
                      <tr key={product._id} className="cart_item">
                        <td className="cart-product-name">
                          {product.name}
                          <strong className="product-quantity">
                            {" "}
                            × {product.quantity}
                          </strong>
                        </td>
                        <td className="cart-product-total">
                          <span className="amount">
                            Rs. {(product.price * product.quantity).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="cart-subtotal">
                      <th>Cart Subtotal</th>
                      <td>
                        <span className="amount">
                          Rs. {subtotal.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                    {couponDiscount > 0 && (
                      <tr className="cart-discount">
                        <th>Coupon Discount</th>
                        <td>
                          <span className="amount">
                            - Rs. {couponDiscount.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr className="order-total">
                      <th>Order Total</th>
                      <td>
                        <strong>
                          <span className="amount">
                            Rs. {(subtotal - couponDiscount).toFixed(2)}
                          </span>
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div className="payment-method">
                  <div className="payment-accordion">
                    <div className="order-button-payment">
                      <input
                        value="Place order With online payment"
                        type="button"
                        onClick={paymentHandler}
                      />
                    </div>
                    <div className="order-button-payment">
                      <input
                        value="Place order with cash on delivery"
                        type="button"
                        onClick={handlePlaceOrder}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

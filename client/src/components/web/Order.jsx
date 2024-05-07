import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import { IDContext } from './hooks/IDContext';

// Helper function to get product by ID
const getProductById = (productItems, productId) => {
  return productItems.find((product) => product._id === productId);
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const { updateID } = useContext(IDContext);

  useEffect(() => {
    // Fetch data from multiple endpoints
    const fetchData = async () => {
      try {
        const orderResponse = await axios.get(`${window.react_app_url + window.order_url}`);
        const orderItemResponse = await axios.get(`${window.react_app_url + window.order_item_url}`);
        const productResponse = await axios.get(`${window.react_app_url + window.product_url}`);

        setOrders(orderResponse.data.data);
        setOrderItems(orderItemResponse.data.data);
        setProductItems(productResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="page-banner">
        <div className="container-fluid pl-60 pr-60">
          <div className="page-banner-content">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/">Setting</NavLink>
              </li>
              <li className="active">
                <NavLink to="/order">Order</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="Shopping-cart-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {orders.length === 0 ? (
                <p>
                  No orders found. <Link to="/shop">Want to place an order?</Link>
                </p>
              ) : (
                <div className="table-content table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order Id</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Product Price</th>
                        <th>Payment Type</th>
                        <th>Order Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Loop through orders */}
                      {orders.map((order) =>
                        // Filter order items by order ID and map them
                        orderItems
                          .filter((item) => item.orderId === order._id)
                          .map((item, index) => {
                            // Get product details by ID
                            const product = getProductById(productItems, item.productId);
                            const orderDate = new Date(order.orderDate);
                            const formattedDate = orderDate.toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });

                            return (
                              <tr key={index}>
                                <td className="raavin-product-remove">
                                  {order._id}
                                </td>
                                <td className="raavin-product-thumbnail">
                                  <Link to="/product-details" onClick={() => updateID(product._id)}>
                                    <img
                                      src={`${window.react_app_url}public/images/products/${product?.productimg}`}
                                      alt=""
                                      className="product-image"
                                    />
                                  </Link>
                                </td>
                                <td className="raavin-product-name">
                                  {product ? product.name : ""}
                                </td>
                                <td className="raavin-product-size">
                                  {item.size}
                                </td>
                                <td className="raavin-product-price">
                                  {item.quantity}
                                </td>
                                <td className="raavin-product-price">
                                  {(product?.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="raavin-product-price">
                                  {order.paymentType}
                                </td>
                                <td className="raavin-product-price">
                                  {formattedDate}
                                </td>
                                <td className="product-subtotal">
                                  {order.status}
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { IDContext } from './hooks/IDContext';

const Cart = () => {
  const [cartItemsIds, setCartItemsIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const { updateID } = useContext(IDContext);

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    updateSubtotal(updatedCartItems);
    const updatedCartItemsIds = updatedCartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));
    localStorage.setItem("cart-items", JSON.stringify(updatedCartItemsIds));
  };

  const removeCartItem = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCartItems);
    updateSubtotal(updatedCartItems);
    const updatedCartItemsIds = updatedCartItems.map((item) => item._id);
    localStorage.setItem("cart-items", JSON.stringify(updatedCartItemsIds));
  };

  const updateSubtotal = (items) => {
    const subtotalAmount = items.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    setSubtotal(subtotalAmount);
  };

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
            return { ...product, quantity: item.quantity, size : item.size };
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
                <NavLink to="/shop">Shop</NavLink>
              </li>
              <li className="active">
                <NavLink to="/cart">Shopping Cart</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="Shopping-cart-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {cartItems.length === 0 ? (
                <p className="text-center text-xl">
                  No cart products found.
                  <Link to="/shop">
                  <span className="text-blue-600 hover:underline">
                    {" "}
                    Want to add ?
                  </span>
                </Link>
                </p>
              ) : (
                <form action="#">
                  <div className="table-content table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="raavin-product-remove">Remove</th>
                          <th className="raavin-product-thumbnail">Image</th>
                          <th className="cart-product-name">Product</th>
                          <th className="cart-product-size">Size</th>
                          <th className="raavin-product-price">Unit Price</th>
                          <th className="raavin-product-quantity">Quantity</th>
                          <th className="raavin-product-subtotal">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((product) => (
                          <tr key={product._id}>
                            <td className="raavin-product-remove">
                              <button
                                onClick={() => removeCartItem(product._id)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                            <td className="raavin-product-thumbnail">
                              <Link to="/product-details" onClick={() => updateID(product._id)}>
                                <img
                                  src={`${window.react_app_url}public/images/products/${product.productimg}`}
                                  alt=""
                                  className="product-image"
                                />
                              </Link>
                            </td>
                            <td className="raavin-product-name">
                              {product.name}
                            </td>
                            <td className="raavin-product-size">
                              {product.size}
                            </td>
                            <td className="raavin-product-price">
                              <span className="amount">
                                Rs. {product.price.toFixed(2)}
                              </span>
                            </td>
                            <td className="raavin-product-quantity">
                              <input
                                className="input-text qty text"
                                step="1"
                                min="1"
                                name="quantity"
                                value={product.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    product._id,
                                    parseInt(e.target.value)
                                  )
                                }
                                title="Qty"
                                type="number"
                              />
                            </td>
                            <td className="product-subtotal">
                              <span className="amount">
                                Rs.{" "}
                                {(product.price * product.quantity).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-md-5 ml-auto">
                      <div className="cart-page-total">
                        <h2>Cart totals</h2>
                        <ul>
                          <li>
                            Subtotal <span>Rs. {subtotal.toFixed(2)}</span>
                          </li>
                          <li>
                            Total <span>Rs. {subtotal.toFixed(2)}</span>
                          </li>
                        </ul>
                        <NavLink to="/checkout">Proceed to checkout</NavLink>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;

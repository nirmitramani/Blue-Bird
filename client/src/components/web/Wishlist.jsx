import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { BsCartPlusFill, BsFillCartCheckFill } from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { IDContext } from "./hooks/IDContext";

const Wishlist = () => {
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { updateID } = useContext(IDContext);

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.review_url}`)
      .then((result) => {
        setReviews(result.data.data);
      })
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cart-items");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const toggleFavorite = (productId) => {
    const isFavorite = favorites.includes(productId);

    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((id) => id !== productId);
      toast.success("Product Succefully Remove from Wishlist", {
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
      updatedFavorites = [...favorites, productId];
      toast.success("Product Succefully Add in Wishlist", {
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

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const toggleCartItems = (productId) => {
    const isCartItem = cartItems.some((item) => item.productId === productId);

    let updatedCartItems;

    if (isCartItem) {
      // Remove the item if it's already in the cart
      updatedCartItems = cartItems.filter(
        (item) => item.productId !== productId
      );
      toast.success("Product Succefully Remove from Cart", {
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
      // Add the item to the cart with a default quantity of 1
      const newItem = { productId, quantity: 1 };
      updatedCartItems = [...cartItems, newItem];
      toast.success("Product Succefully Add in Cart", {
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

    localStorage.setItem("cart-items", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const calculateAverageRating = (product) => {
    const productReviews = reviews.filter(
      (review) => review.productId === product._id
    );

    const ratingCount = productReviews.length;

    if (ratingCount === 0) {
      return { averageRating: 0, ratingCount: 0 };
    }

    const totalRating = productReviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    const averageRating = totalRating / ratingCount;

    const fullStars = Math.floor(averageRating);

    const hasHalfStar = averageRating - fullStars >= 0.1;

    return { averageRating, ratingCount, fullStars, hasHalfStar };
  };

  // Fetch product data from the server and filter by favorite product IDs
  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.product_url}`)
      .then((result) => {
        const allProducts = result.data.data;

        // Filter products based on favoriteProductIds
        const filteredFavoriteProducts = allProducts.filter((product) =>
          favorites.includes(product._id)
        );

        setFavoriteProducts(filteredFavoriteProducts);
      })
      .catch((err) => console.log(err));
  }, [favorites]);

  const removeFavorite = (productId) => {
    const updatedFavorites = favorites.filter((id) => id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const loadMore = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 12);
  };

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
                <NavLink to="/wishlist">Wishlist</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shop-topbar-area shop-topbar-area-reverse pt-100 pb-100">
        <div className="container">
          <div className="row">
            {favoriteProducts.length === 0 ? (
              <p className="text-center text-xl">
                No favorite products found.
                <Link to="/shop">
                  <span className="text-blue-600 hover:underline">
                    {" "}
                    Want to add ?
                  </span>
                </Link>
              </p>
            ) : (
              <div className="col-lg-12">
                <div className="shop-topbar-wrapper shop-list-topbar-wrapper">
                  <div className="grid-list">
                    <ul className="nav">
                      <li>
                        <a
                          className="active show"
                          data-bs-toggle="tab"
                          href="#list"
                          title="List"
                        >
                          <i className="fa fa-th-list"></i>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="toolbar-short-area d-md-flex align-items-center">
                    <div className="toolbar-shorter">
                      <label>Sort By:</label>
                      <select className="nice-select wide">
                        <option value="">Select</option>
                        <option value="price:asc">Price: Lowest first</option>
                        <option value="price:desc">Price: Highest first</option>
                        <option value="name:asc">Product Name: A to Z</option>
                        <option value="name:desc">Product Name: Z to A</option>
                      </select>
                    </div>
                    <p className="show-product">
                      {/* Showing {indexOfFirstProduct + 1}–
                      {Math.min(indexOfLastProduct, products.length)} of{" "}
                      {products.length} results */}
                    </p>
                  </div>
                </div>
                <div className="shop-product">
                  <div className="tab-content">
                    <div id="list" className="tab-pane show fade in active">
                      <div className="list-view">
                        {favoriteProducts.map((product) => (
                          <div className="row" key={product._id}>
                            <div className="col-lg-1 col-md-1"></div>
                            <div className="col-lg-3 col-md-3">
                              <div
                                className="product-img pro-list-item pro-list-sidebar-items"
                                style={{
                                  display: "inline-block",
                                  width: "355px",
                                  height: "250px",
                                }}
                              >
                                <NavLink
                                  to="/product-details"
                                  onClick={() => updateID(product._id)}
                                >
                                  <img
                                    className="primary-img"
                                    src={`${window.react_app_url}public/images/products/${product.productimg}`}
                                    alt={product.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  {/* <img
                                    className="secondary-img"
                                    src={product.productthumbimg}
                                    alt={product.name}
                                  /> */}
                                </NavLink>
                              </div>
                            </div>
                            <div className="col-lg-8 col-md-8">
                              <div className="pro-list-content">
                                <h5 className="product-name">
                                  <NavLink
                                    to="/product-details"
                                    onClick={() => updateID(product._id)}
                                    title={product.name}
                                  >
                                    {product.name}
                                  </NavLink>
                                </h5>
                                <div
                                  className="rating list-rating"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star}>
                                      {star <=
                                      calculateAverageRating(product)
                                        .fullStars ? (
                                        <AiFillStar className="text-xl text-yellow-500" />
                                      ) : star ===
                                          calculateAverageRating(product)
                                            .fullStars +
                                            1 &&
                                        calculateAverageRating(product)
                                          .hasHalfStar ? (
                                        <FaStarHalfAlt className="text-xl text-yellow-500" />
                                      ) : (
                                        <AiOutlineStar className="text-xl text-yellow-500" />
                                      )}
                                    </span>
                                  ))}
                                </div>

                                <div className="price-box list-price-box">
                                  <span className="price">
                                    Rs. {product.price.toFixed(2)}
                                  </span>
                                </div>

                                <div className="list-text">
                                  <p>{product.description}</p>
                                </div>

                                <div className="product-action product-action-2">
                                  <div className="product-action-inner">
                                    <div className="cart">
                                      {cartItems.includes(product._id) ? (
                                        <NavLink
                                          onClick={() =>
                                            toggleCartItems(product._id)
                                          }
                                        >
                                          <span>Remove from Cart</span>
                                        </NavLink>
                                      ) : (
                                        <NavLink
                                          onClick={() =>
                                            toggleCartItems(product._id)
                                          }
                                        >
                                          <span>Add To Cart</span>
                                        </NavLink>
                                      )}
                                    </div>
                                    <ul className="add-to-links">
                                      <li className="rav-wishlist">
                                        <NavLink
                                          onClick={() =>
                                            toggleFavorite(product._id)
                                          }
                                          data-bs-toggle="tooltip"
                                          title="Add To Wishlist"
                                        >
                                          {favorites.includes(product._id) ? (
                                            <i className="fa fa-heart"></i>
                                          ) : (
                                            <i className="fa fa-heart-o"></i>
                                          )}
                                        </NavLink>
                                      </li>
                                      <li className="rav-quickviewbtn">
                                        <NavLink
                                          to="/product-details"
                                          onClick={() => updateID(product._id)}
                                          data-bs-toggle="modal"
                                          title="Quick view"
                                        >
                                          <i className="fa fa-eye"></i>
                                        </NavLink>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pagination-area pagination-area-2 shop-list-pagination">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 p-0">
                        {visibleProducts < favoriteProducts.length && (
                          <div className="flex justify-center mt-4 mb-5">
                            <button label="Load more" onClick={loadMore} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Wishlist;

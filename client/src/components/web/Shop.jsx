import React, { useState, useEffect, useContext } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { BsCartPlusFill, BsFillCartCheckFill } from "react-icons/bs";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { IDContext } from "./hooks/IDContext";

const productsPerPage = 12;

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

const Shop = () => {
  const emailInput = useFormInput("Enter your e-mail");
  const searchInput = useFormInput("Input a Text");
  const { updateID, id, resetID, gender, updateGender, resetGender } =
    useContext(IDContext);
  const [selectedGender, setSelectedGender] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [productsStockSize, setProductsStockSize] = useState(null);

  useEffect(() => {
    setSelectedGender(gender);
  }, [gender]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted: ", emailInput.value);
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

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.review_url}`)
      .then((result) => {
        setReviews(result.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

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
      const newItem = { productId, size: '8', quantity: 1 };
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

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.product_category_url}`)
      .then((result) => {
        setProductCategories(result.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.window.product_stock_size}`)
      .then((result) => {
        setProductsStockSize(result.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.product_url}`)
      .then((result) => {
        const activeProducts = result.data.data.filter(product => product.status === 'Active');
        setProducts(activeProducts);
      })
      .catch((err) => console.log(err));
  }, []);

  const filterProducts = () => {
    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryid === selectedCategory
      );
    }

    if (selectedSize && productsStockSize) {
      filteredProducts = filteredProducts.filter((product) => {
        const productSizes = productsStockSize.filter(
          (size) => size.productId === product._id
        );
        return productSizes.some((size) => size.size === selectedSize);
      });
    }

    // Filter products by gender (male or female)
    if (selectedGender) {
      filteredProducts = filteredProducts.filter((product) => {
        const category = productCategories.find(
          (category) => category._id === product.categoryid
        );
        return category && category.gender === selectedGender;
      });
    }

    return filteredProducts.slice(0, visibleProducts);
  };

  const handleGenderChange = (gender) => {
    updateGender(gender);
    setSelectedGender(gender);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const loadMore = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + productsPerPage);
  };
  

  return (
    <>
      <div className="body-wrapper">
        <div className="page-banner">
          <div className="container-fluid pl-60 pr-60">
            <div className="page-banner-content">
              <ul>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li className="active">
                  <NavLink to="/shop">Shop</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="shop-topbar-area shop-topbar-area-reverse pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                <div className="shop-sidebar">
                  <div className="category">
                    <h4>Categories</h4>
                    <div className="category-list">
                      <ul>
                        <li key="all">
                          <h6>
                            <a
                              href="javascript:void(0)"
                              onClick={() => {
                                resetGender();
                                handleGenderChange(null);
                                handleCategoryChange(null);
                                handleSizeChange(null);
                              }}
                              className={`${
                                !selectedGender && !selectedCategory
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Show All
                            </a>
                          </h6>
                        </li>
                        {["male", "female", "kids"].map((gender) => (
                          <li key={gender}>
                            <h6>
                              <a
                                href="javascript:void(0)"
                                onClick={() => {
                                  handleGenderChange(gender);
                                  handleCategoryChange(null); // Reset category when changing gender
                                }}
                                className={`${
                                  selectedGender === gender ? "active" : ""
                                }`}
                              >
                                {gender.charAt(0).toUpperCase() +
                                  gender.slice(1)}
                              </a>
                            </h6>
                            <ul className="sub-category">
                              {productCategories.map((category) => {
                                if (category.gender === gender) {
                                  return (
                                    <li
                                      className={`list ${
                                        selectedCategory === category._id
                                          ? "active"
                                          : ""
                                      }`}
                                      key={category._id}
                                    >
                                      <a
                                        href="javascript:void(0)"
                                        onClick={() => {
                                          handleCategoryChange(category._id);
                                          handleGenderChange(gender); // Update gender when changing category
                                        }}
                                      >
                                        {category.name}
                                      </a>
                                    </li>
                                  );
                                }
                                return null;
                              })}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="category mt-30">
                    <h4>Size</h4>
                    <div className="category-list">
                      <ul className="size-list">
                        {["S","M","L","XL","XXL" ].map((size) => (
                          <li
                            key={size}
                            className={`list ${
                              selectedSize === size.toString() ? "active" : ""
                            }`}
                          >
                            <a
                              href="javascript:void(0)"
                              onClick={() => handleSizeChange(size.toString())}
                            >
                              {size}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="widge widge-tags top-rated-tags top-rated-tags-reverse">
                  <div className="widge-title">
                    <span>Tags</span>
                  </div>
                  <div className="widge-list widge-tag-list">
                    <ul>
                      <li>
                        <a href="javascript:void(0)">Cargo</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Coords</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Hoodie</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Full Sleeve T-Shirt</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Jeans</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Kurti</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Saree</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">One-pices</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">T-Shirt</a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">Two-pices</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-9 order-1 order-lg-2">
                <div className="shop-topbar-wrapper shop-list-topbar-wrapper">
                  <div className="grid-list">
                    <ul className="nav">
                      <li>
                        <a
                          className="active show"
                          data-bs-toggle="tab"
                          href="#grid"
                          title="Grid"
                        >
                          <i className="fa fa-th-large"></i>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="toolbar-short-area d-md-flex align-items-center">
                    <p className="show-product">
                      Showing 1&ndash; {visibleProducts}
                    </p>
                  </div>
                </div>
                <div className="shop-product">
                  <div className="tab-content">
                    <div id="grid" className="tab-pane show fade in active">
                      <div className="grid-view">
                        <div className="row">
                          {filterProducts().map((product) => (
                            <div
                              key={product._id}
                              className="col-lg-4 col-md-6 col-sm-6"
                            >
                              <div className="single-product single-product-3">
                                <div
                                  className="product-img"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <NavLink
                                    to="/product-details"
                                    onClick={() => updateID(product._id)}
                                    style={{
                                      display: "inline-block",
                                      width: "355px",
                                      height: "250px",
                                    }}
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
                                    <img
                                      className="secondary-img"
                                      src={`${window.react_app_url}public/images/products/${product.productthumbimg[0]}`}
                                      alt={product.name}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </NavLink>

                                  {product.isNew === "Yes" && (
                                    <div className="sticker">
                                      <span>New</span>
                                    </div>
                                  )}

                                  <div className="product-action">
                                    <div className="product-action-inner">
                                      <div className="cart">
                                        {cartItems.some((item) => item.productId === product._id) ? (
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
                                            onClick={() =>
                                              updateID(product._id)
                                            }
                                          >
                                            <i className="fa fa-eye"></i>
                                          </NavLink>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                <div className="product-contents">
                                  <h5 className="product-name">
                                    <NavLink
                                      to="/product-details"
                                      onClick={() => updateID(product._id)}
                                      title={product.name}
                                    >
                                      {product.name}
                                    </NavLink>
                                  </h5>

                                  <div className="price-box">
                                    <span className="price">
                                      Rs. {product.price.toFixed(2)}
                                    </span>
                                  </div>
                                  {/* For rating, you can use a component or icons */}
                                  <div
                                    className="rating"
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
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pagination-area pagination-area-reverse">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-12 p-0">
                        {visibleProducts < products.length && (
                          <div className="flex justify-center mt-4 mb-5">
                            <button onClick={loadMore}>Load more</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;

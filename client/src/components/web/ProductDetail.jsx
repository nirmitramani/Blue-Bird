import React, { useState, useEffect, useContext } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IDContext } from "./hooks/IDContext";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { FaStarHalfAlt } from "react-icons/fa";

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const ProductDetail = () => {
  const { id } = useContext(IDContext);
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [productsStockSize, setProductsStockSize] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(
        `${window.react_app_url + window.product_category_url}/${categoryId}`
      );
      setCategoryName(response.data.data.name);
    } catch (error) {
      console.error("Error fetching category name:", error);
      toast.error("Error fetching category name", {
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

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${window.react_app_url + window.product_url}/${id}`
        );
        setProduct(response.data.data);
        const categoryId = response.data.data.categoryid;
        fetchCategoryName(categoryId);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error fetching product details", {
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

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchProductSizesAndStock = async () => {
      try {
        const response = await axios.get(
          `${window.react_app_url + window.product_stock_size_by_product_id}/${id}`
        );
        setProductsStockSize(response.data.data);
      } catch (error) {
        console.error("Error fetching product sizes and stock:", error);
        // Handle error
      }
    };

    fetchProductSizesAndStock();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${window.react_app_url + window.review_url}`
        );
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Handle error
      }
    };

    fetchReviews();
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
      const parsedCartItems = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
      const productInCart = parsedCartItems.find(
        (item) => item.productId === id
      );
      setSelectedSize(productInCart ? productInCart.size : "");
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      fetchCategoryName(product.categoryid);
    }
  }, [product]);

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

  const reviewCount = reviews.filter(
    (review) => review.productId === id
  ).length;
  const productReview = reviews.filter((review) => review.productId === id);

  const toggleFavorite = (productId) => {
    const isFavorite = favorites.includes(productId);

    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((id) => id !== productId);
      toast.success("Product Successfully Removed from Wishlist", {
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
      toast.success("Product Successfully Added to Wishlist", {
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

  const toggleCartItems = (productId, selectedSize) => {
    const isCartItem = cartItems.some((item) => item.productId === productId);

    let updatedCartItems;

    if (isCartItem) {
      // Remove the item if it's already in the cart
      updatedCartItems = cartItems.filter(
        (item) => item.productId !== productId
      );
      toast.success("Product Successfully Removed from Cart", {
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
      // Add the item to the cart with the selected size and a default quantity of 1
      const newItem = { productId, size: selectedSize, quantity: 1 };
      updatedCartItems = [...cartItems, newItem];
      toast.success("Product Successfully Added to Cart", {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve form data
    const formData = {
      rating: event.target.elements.rating.value,
      description: event.target.elements.description.value,
      name: event.target.elements.name.value,
      productId: id,
    };

    try {
      const response = await axios.post(
        `${window.react_app_url + window.review_url}`,
        formData
      );
      console.log("Form submitted successfully:", response.data);
      if (response.data.status == true) {
        toast.success("Form submitted successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        event.target.reset();
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

  if (!product) {
    return null;
  }

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
                <NavLink to="/product-details">Product Details</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="product-details pt-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-5">
              <div
                className="product-details-right"
                style={{ position: "relative" }}
              >
                <div
                  className="tab-content product-details-tab product-details-large"
                  id="myTabContent"
                  style={{
                    width: "500px",
                    height: "430px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Render single product image */}
                  <div
                    className={`tab-pane fade show active`}
                    id={`single-slide0`}
                    role="tabpanel"
                    aria-labelledby={`single-slide-tab-0`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <div
                      className="single-product-img img-full"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <img
                        src={`${window.react_app_url}public/images/products/${product.productimg}`}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>

                  {/* Render product thumbnails */}
                  {product.productthumbimg.map((image, index) => (
                    <div
                      key={index}
                      className={`tab-pane fade`}
                      id={`single-slide${index + 1}`}
                      role="tabpanel"
                      aria-labelledby={`single-slide-tab-${index + 1}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <div
                        className="single-product-img img-full"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <img
                          src={`${window.react_app_url}public/images/products/${image}`}
                          alt=""
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {/* Background blur effect */}
                  <div
                    className="blur-effect"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backdropFilter: "blur(8px)",
                      zIndex: -1,
                    }}
                  ></div>
                </div>

                {/* Render OwlCarousel with single product image and thumbnails */}
                <div className="single-product-menu">
                  <OwlCarousel
                    className="nav single-slide-menu owl-carousel"
                    items={5} // Adjust the number of items to accommodate the single image and thumbnails
                    margin={10}
                    dots={false}
                  >
                    {/* Add single product image to OwlCarousel */}
                    <div
                      className="single-tab-menu img-full"
                      style={{
                        width: "100px",
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <a
                        className="active"
                        data-bs-toggle="tab"
                        id="single-slide-tab-0"
                        href="#single-slide0"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <img
                          src={`${window.react_app_url}public/images/products/${product.productimg}`}
                          alt=""
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </div>
                    {/* Add product thumbnails to OwlCarousel */}
                    {product.productthumbimg.map((image, index) => (
                      <div
                        key={index}
                        className="single-tab-menu img-full"
                        style={{
                          width: "100px",
                          height: "100px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <a
                          data-bs-toggle="tab"
                          id={`single-slide-tab-${index + 1}`}
                          href={`#single-slide${index + 1}`}
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <img
                            src={`${window.react_app_url}public/images/products/${image}`}
                            alt=""
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </a>
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-md-7">
              <div className="product-details-right">
                <div className="product-details-contents">
                  <h5 className="product-details-name">
                    <a href="javascript:void(0)" title={product.name}>
                      {product.name}
                    </a>
                  </h5>

                  <div
                    className="rating-2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= calculateAverageRating(product).fullStars ? (
                          <AiFillStar className="text-xl text-yellow-500" />
                        ) : star ===
                            calculateAverageRating(product).fullStars + 1 &&
                          calculateAverageRating(product).hasHalfStar ? (
                          <FaStarHalfAlt className="text-xl text-yellow-500" />
                        ) : (
                          <AiOutlineStar className="text-xl text-yellow-500" />
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="review">
                    <a href="javascript:void(0)">
                      ({reviewCount} customer reviews)
                    </a>
                  </div>

                  <div className="price-box-2">
                    <span className="price">
                      Rs. {product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="short-desc">
                   {product.shortdescription}
                  </p>
                  {productsStockSize && (
                    <div className="mb-4">
                      <label
                        htmlFor="size"
                        className="block text-gray-700 font-medium text-sm"
                      >
                        Size
                      </label>
                      <div className="flex flex-wrap mt-3">
                        {productsStockSize.map((sizeData, index) => (
                          <div key={index} className="mr-4 mb-4">
                            <input
                              type="radio"
                              id={`size-${sizeData.size}`}
                              name="size"
                              value={sizeData.size}
                              className="hidden peer"
                              required
                              onChange={() => handleSizeChange(sizeData.size)}
                            />
                            <label
                              htmlFor={`size-${sizeData.size}`}
                              className={`inline-flex items-center justify-center p-3 cursor-pointer rounded-full border border-gray-700 transition-colors ${
                                sizeData.size === selectedSize
                                  ? "bg-black text-white border-transparent"
                                  : " text-black bg-white hover:bg-gray-100"
                              } text-lg leading-tight`}
                            >
                              {sizeData.size}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form className="pro-details-cart" action="#" method="post">
                    <div className="quantity">
                      <input
                        className="input-text qty text"
                        step="1"
                        min="1"
                        name="quantity"
                        value="1"
                        title="Qty"
                        size="4"
                        type="number"
                        disabled
                      />
                    </div>

                    <a
                      onClick={() => toggleCartItems(product._id, selectedSize)}
                    >
                      <div className="qty-cart-btn">
                        {cartItems.some(
                          (item) => item.productId === product._id
                        ) ? (
                          <span>Remove from Cart</span>
                        ) : (
                          <span>Add To Cart</span>
                        )}
                      </div>
                    </a>

                    <div className="group-btn">
                      <div className="qty-cart-btn qty-cart-btn-2">
                        {favorites.includes(product._id) ? (
                          <NavLink
                            onClick={() => toggleFavorite(product._id)}
                            data-bs-toggle="tooltip"
                            title="Remove from Wishlist"
                          >
                            <i className="fa fa-heart"></i> Remove from Wishlist
                          </NavLink>
                        ) : (
                          <NavLink
                            onClick={() => toggleFavorite(product._id)}
                            data-bs-toggle="tooltip"
                            title="Add To Wishlist"
                          >
                            <i className="fa fa-heart-o"></i> Add To Wishlist
                          </NavLink>
                        )}
                      </div>
                    </div>
                    <div className="product-meta">
                      <p>
                        Categories:
                        <a href="javascript:void(0)"> {categoryName}</a>
                      </p>
                    </div>
                    <div className="single-product-sharing">
                      <h3>Share this product :</h3>
                      <ul className="social-icon">
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
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vertical-tab-area">
        <div className="container">
          <div className="vertical-tab-item">
            <div className="row g-0">
              <div className="col-lg-3">
                <ul className="nav vertical-product-tabs" role="tablist">
                  <li className="desc-tab active">
                    <a data-bs-toggle="tab" href="#description">
                      Description
                    </a>
                  </li>
                  <li className="review-tab">
                    <a data-bs-toggle="tab" href="#riview">
                      Review ({reviewCount})
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-9">
                <div className="tab-content vertical-tab-desc">
                  <div
                    id="description"
                    className="tab-pane show fade in active"
                  >
                    <p>{product.description}</p>
                  </div>
                  <div id="riview" className="tab-pane fade">
                    <div className="reviews">
                      <div className="comments">
                        <h2>{reviewCount} reviews for Ornare sed consequat</h2>
                        {reviewCount > 0 && (
                          <div className="comment-list">
                            {reviews
                              .filter((review) => review.productId === id)
                              .map((review, index) => (
                                <div key={index} className="user-details">
                                  <div className="user-img">
                                    <img
                                      src="images/product-details/user.png"
                                      alt=""
                                    />
                                  </div>
                                  <p className="user-info">
                                    <span>{review.name} -</span>{" "}
                                    {formatDate(review.createdAt)}
                                  </p>
                                  <div className="rating user-rating">
                                    {[...Array(5).keys()].map((star) => (
                                      <i
                                        key={star}
                                        className={`fa ${
                                          star < review.rating
                                            ? "fa-star"
                                            : "fa-star-o"
                                        }`}
                                      ></i>
                                    ))}
                                  </div>
                                  <span className="user-comment">
                                    {review.description}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="feedback-area">
                        <div className="feedback">
                          <h3
                            className="feedback-title"
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Your Feedback
                          </h3>
                          <form onSubmit={handleSubmit}>
                            <p className="your-opinion">
                              <label>Your Rating</label>
                              <span>
                                <select className="star-rating" name="rating">
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                              </span>
                            </p>
                            <p className="feedback-form-author">
                              <label htmlFor="name">Name</label>
                              <input
                                id="name"
                                name="name"
                                size="30"
                                aria-required="true"
                                type="text"
                              />
                            </p>
                            <p className="feedback-form">
                              <label htmlFor="feedback">Your Review</label>
                              <textarea
                                id="feedback"
                                name="description"
                                cols="45"
                                rows="8"
                                aria-required="true"
                              ></textarea>
                            </p>

                            <div className="qty-cart-btn feedback-btn">
                              <input type="Submit" />
                            </div>
                          </form>
                        </div>
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

export default ProductDetail;

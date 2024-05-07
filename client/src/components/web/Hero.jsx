import React, { useState, useEffect, useContext } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { IDContext } from "./hooks/IDContext";
import { toast } from "react-toastify";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { FaStarHalfAlt } from "react-icons/fa";

const fetchData = async () => {
  try {
    const result = await axios.get(
      `${window.react_app_url + window.product_url}`
    );
    const activeProducts = result.data.data.filter(
      (product) => product.status === "Active"
    );
    return activeProducts;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const Hero = () => {
  const [productList, setProductList] = useState(null);
  const { updateID, updateGender } = useContext(IDContext);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);

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

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.review_url}`)
      .then((result) => {
        setReviews(result.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const data = await fetchData();
        if (data) {
          setProductList(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductList();
  }, []);

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

  const slides = [
    {
      id: 1,
      title: "Explore Our Latest Collection",
      subtitle: "Discover the Perfect Pair",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      bgClass: "bg-1",
    },
    {
      id: 2,
      title: "Step into Comfort and Style",
      subtitle: "New Arrivals",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      bgClass: "bg-2",
    },
    {
      id: 5,
      title: "Find Your Perfect Fit",
      subtitle: "Shop Our Range of Sizes",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      bgClass: "bg-1",
    },
    {
      id: 6,
      title: "Get Ready for Adventure",
      subtitle: "Explore Our Outdoor Collection",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      bgClass: "bg-2",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Emily Johnson",
      image: "images/testimonial/1.png",
      content:
        "Bluebird Clothing offers a unique blend of trendy yet timeless styles that cater to various tastes. Whether you're looking for casual everyday wear or something more formal for a special occasion, you're sure to find something that suits your style.",
    },
    {
      id: 2,
      name: "David Smith",
      image: "images/testimonial/1.png",
      content:
        " I am impressed by the level of customer service provided by Bluebird Clothing. From assistance with sizing to prompt responses to inquiries, their team went above and beyond to ensure a smooth shopping experience.",
    },
    {
      id: 3,
      name: "Jessica Thompson",
      image: "images/testimonial/1.png",
      content:
        " One of the standout features of Bluebird Clothing is the exceptional quality of their garments. Each piece I received felt well-made and durable, showcasing attention to detail and craftsmanship.",
    },
  ];

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here
    console.log("Email submitted: ", email);
  };

  const handleFocus = () => {
    if (email === "Enter your e-mail") {
      setEmail("");
    }
  };

  const handleBlur = () => {
    if (email === "") {
      setEmail("Enter your e-mail");
    }
  };
  return (
    <>
      <div className="slider-area">
        <div className="container-fluid">
          <OwlCarousel
            className="owl-carousel"
            nav
            items={1}
            dots={false}
            autoplay
            autoplayTimeout={3000}
            loop
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`single-slide align-center-left fullscreen animation-style-01 ${slide.bgClass}`}
              >
                <div className="slider-progress"></div>
                <div className="container">
                  <div className="slider-content">
                    <h2>{slide.title}</h2>
                    <p>{slide.subtitle}</p>
                    <div className="default-btn slide-btn">
                      <NavLink className="links" to={slide.buttonLink}>
                        {slide.buttonText}
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>

      <div className="static">
        <div className="container">
          <div className="static-info">
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-12">
                <ul className="info">
                  <li className="content-info">
                    <h3>FREE SHIPPING & RETURNS</h3>
                    <p>
                      Enjoy free shipping and hassle-free returns on all orders
                    </p>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12">
                <ul className="info">
                  <li className="content-info">
                    <h3>COMFORT GUARANTEE</h3>
                    <p>
                      Experience ultimate comfort with our specially designed
                      clothing
                    </p>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12">
                <ul className="info info-bt">
                  <li className="content-info">
                    <h3>STYLISH DESIGNS</h3>
                    <p>
                      Discover trendy and fashionable shoe designs for every
                      occasion
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="banner pb-50">
        <div className="container">
          <div className="row g-0">
            <div className="col-lg-12">
              <OwlCarousel className="banner-active owl-carousel" dots={false}>
                <div className="single-banner">
                  <div className="banner-img">
                    <NavLink to="/shop" onClick={() => updateGender("male")}>
                      <img src="images/banner/1_1.jpg" alt="" />
                    </NavLink>
                  </div>
                </div>

                <div className="single-banner">
                  <div className="banner-img">
                    <NavLink to="/shop" onClick={() => updateGender("kids")}>
                      <img src="images/banner/2_1.jpg" alt="" />
                    </NavLink>
                  </div>
                </div>

                <div className="single-banner">
                  <div className="banner-img">
                    <NavLink to="/shop" onClick={() => updateGender("female")}>
                      <img src="images/banner/3_1.jpg" alt="" />
                    </NavLink>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>

      <section className="new-product pt-55 pb-100">
        <div className="container">
          <div className="pos-title">
            <h2>new arrivals</h2>
            <p>
            Introducing Bluebird's Latest Collection: Elevate Your Wardrobe with Our New Arrivals, Featuring Timeless Pieces Crafted with Style, Quality, and Unmatched Elegance. Shop Now!
            </p>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="pos-content">
                {productList !== null && (
                  <OwlCarousel
                    className="new-product-active owl-carousel"
                    items={4}
                    dots={false}
                  >
                    {productList.slice(0, 10).map((product) => (
                      <div key={product._id} className="product-slide-item">
                        <div className="single-product">
                          <div className="product-img">
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
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <img
                                className="secondary-img"
                                src={`${window.react_app_url}public/images/products/${product.productthumbimg[0]}`}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </NavLink>
                            <div className="sticker">
                              <span>New</span>
                            </div>

                            <div className="product-action">
                              <div className="product-action-inner">
                                <div className="cart">
                                  {cartItems.some((item) => item.productId === product._id)  ? (
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
                                      title="Quick view"
                                      onClick={() => updateID(product._id)}
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
                              <NavLink to="product-detail" title={product.name}>
                                {product.name}
                              </NavLink>
                            </h5>

                            <div className="price-box">
                              <span className="price">
                                Rs. {product.price.toFixed(2)}
                              </span>
                            </div>

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
                                  calculateAverageRating(product).fullStars ? (
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
                    {/* <div className="product-slide-item">
                      <div className="single-product">
                        <div className="product-img">
                          <NavLink
                            to="/shop"
                            className="block w-64 h-36 bg-gray-200 flex items-center justify-center"
                          >
                            <span className="text-center">Show More</span>
                          </NavLink>
                        </div>
                      </div>
                    </div> */}
                  </OwlCarousel>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="static-center">
        <div className="static-content">
          <div className="container">
            {/* <h3>Running with you force of nature</h3>
            <p>
              Embrace the changing seasons with our Autumn/Winter 2024
              collection. Discover transitional pieces designed to keep you
              stylish and comfortable as you navigate the elements. Enjoy a 20%
              discount on selected items and elevate your wardrobe with
              nature-inspired essentials. Step into the new season with
              confidence and style.
            </p> */}
            <div className="static-btn">
              <NavLink className="links links-2" to="/shop">
                Shop now
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      <div className="testimonials">
        <div className="container">
          <div className="pos-content">
            <OwlCarousel className="testimonials-active owl-carousel" items={1}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonials-item">
                  <div className="item">
                    <div className="test-box author">
                      <div className="test-img">
                        <img src={testimonial.image} alt="" />
                      </div>
                      <div className="test-content">
                        <p className="test-des">{testimonial.content}</p>
                        <p className="des-post">
                          <span>{testimonial.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      </div>

      <section className="featured-pro pt-95">
        <div className="container">
          <div className="pos-title pos-title-2">
            <h2>Products</h2>
            <p>
            Discover the Beauty of Bluebird: Explore Our Diverse Range of Exquisite Products, From Elegant Dresses to Stylish Accessories, Each Designed to Elevate Your Fashion Experience.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-12">
              {productList !== null && (
                <OwlCarousel
                  className="featured-pro-active owl-carousel"
                  margin={10}
                  items={6}
                  nav
                  dots={false}
                >
                  {productList.slice(0, 20).map((product) => (
                    <div
                      key={product.id}
                      className="single-product single-featured-pro"
                    >
                      <div className="product-img">
                        <NavLink
                          to="product-details"
                          onClick={() => updateID(product._id)}
                          style={{
                            display: "block",
                            width: "250px",
                            height: "200px",
                          }}
                        >
                          <img
                            className="primary-img"
                            src={`${window.react_app_url}public/images/products/${product.productimg}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <img
                            className="secondary-img"
                            src={`${window.react_app_url}public/images/products/${product.productthumbimg[0]}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </NavLink>
                      </div>
                      <div className="product-contents featured-pro-contents">
                        <h5 className="product-name">
                          <NavLink to="product-details" title={product.name}>
                            {product.name}
                          </NavLink>
                        </h5>
                        <div className="price-box">
                          <span className="price">
                            Rs. {product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </OwlCarousel>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="static-bottom">
        <div className="row g-0">
          <div className="col-lg-6 col-md-6">
            <div className="banner-box">
              <div className="banner-img">
                <NavLink to="/shop">
                  <img src="images/banner/5_1.jpg" alt="" />
                </NavLink>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="banner-box">
              <div className="banner-img">
                <NavLink to="/shop">
                  <img src="images/banner/6_1.jpg" alt="" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

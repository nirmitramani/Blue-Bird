import React, { useState, useEffect } from "react";
import Isotope from "isotope-layout";
import { NavLink } from "react-router-dom";

const portfolioItems = [
    {
      imgSrc: "images/portfolio/1.jpg",
      title: "Coffee & Cookie Time",
      category: ["company", "general"]
    },
    {
      imgSrc: "images/portfolio/3.jpg",
      title: "There are many variations",
      category: ["computers", "hipster"]
    },
    {
      imgSrc: "images/portfolio/6.jpg",
      title: "Coffee & Cookie Time",
      category: ["just-food", "general"]
    },
    {
      imgSrc: "images/portfolio/8.jpg",
      title: "passage of Lorem Ipsum",
      category: ["hipster", "company"]
    },
    {
      imgSrc: "images/portfolio/8.jpg",
      title: "looked up one of the more",
      category: ["just-food", "computers"]
    },
    {
      imgSrc: "images/portfolio/2.jpg",
      title: "If you are going to use",
      category: ["company", "general"]
    },
    {
      imgSrc: "images/portfolio/3.jpg",
      title: "accompanied by English",
      category: ["company", "general"]
    },
    {
      imgSrc: "images/portfolio/4.jpg",
      title: "Coffee & Cookie Time",
      category: ["computers", "hipster"]
    },
    {
      imgSrc: "images/portfolio/5.jpg",
      title: "Coffee & Cookie Time",
      category: ["just-food", "general"]
    },
    {
      imgSrc: "images/portfolio/6.jpg",
      title: "Coffee & Cookie Time",
      category: ["hipster", "company"]
    },
    {
      imgSrc: "images/portfolio/7.jpg",
      title: "Coffee & Cookie Time",
      category: ["just-food", "computers"]
    },
    {
      imgSrc: "images/portfolio/8.jpg",
      title: "Coffee & Cookie Time",
      category: ["company", "general"]
    }
  ];  

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("*"); // Initial active filter

  useEffect(() => {
    // Initialize Isotope
    const iso = new Isotope(".co-isotop-grid-1", {
      itemSelector: ".co-isotop-item-1",
      layoutMode: "fitRows",
      filter: activeFilter, // Apply initial filter
    });

    // Filter items on button click
    const filterButtons = document.querySelectorAll(
      ".co-isotop-filter-1 button"
    );
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filterValue = button.getAttribute("data-filter");
        iso.arrange({ filter: filterValue });

        // Update active filter state
        setActiveFilter(filterValue);
      });
    });

    return () => {
      // Destroy Isotope instance when component unmounts
      iso.destroy();
    };
  }, [activeFilter]); // Run effect whenever activeFilter changes

  return (
    <>
      <div className="page-banner">
        <div className="container-fluid pl-60 pr-60">
          <div className="page-banner-content">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="active">
                <NavLink to="/portfolio">Portfolio</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="co-portfolio pt-100 pb-70">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-lg-12 col-md-12  text-center">
              <div className="co-isotop-filter-1 isotop-filter">
                <button
                  className={activeFilter === "*" ? "active" : ""}
                  data-filter="*"
                >
                  Filter - All
                </button>
                <button
                  className={activeFilter === ".company" ? "active" : ""}
                  data-filter=".company"
                >
                  Company
                </button>
                <button
                  className={activeFilter === ".computers" ? "active" : ""}
                  data-filter=".computers"
                >
                  Computers
                </button>
                <button
                  className={activeFilter === ".general" ? "active" : ""}
                  data-filter=".general"
                >
                  General
                </button>
                <button
                  className={activeFilter === ".hipster" ? "active" : ""}
                  data-filter=".hipster"
                >
                  Hipster
                </button>
                <button
                  className={activeFilter === ".just-food" ? "active" : ""}
                  data-filter=".just-food"
                >
                  Just Food
                </button>
              </div>
            </div>
          </div>
          <div className="co-isotop-grid-1 isotop-grid row">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className={`co-isotop-item-1 isotop-item company general col-xl-3 col-lg-6 col-md-6 col-12 ${item.category.join(
                  " "
                )}`}
              >
                <div className="single-portfolio img-full">
                  <img src={item.imgSrc} alt="" />
                  <div className="content">
                    <div className="title">{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Portfolio;

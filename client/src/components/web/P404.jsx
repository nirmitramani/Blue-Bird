import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function P404() {
    return (
        <>
            <div className="page-banner">
                <div className="container-fluid pl-60 pr-60">
                    <div className="page-banner-content">
                        <ul>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li className="active"><NavLink to="/404">Error 404</NavLink></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="error-404-page pt-100 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="error-wrapper text-center">
                                <div className="error-text">
                                    <h1>404</h1>
                                    <h2>Opps! PAGE NOT BE FOUND</h2>
                                    <p>Sorry but the page you are looking for does not exist, have been removed, name changed or is temporarily unavailable.</p>
                                </div>
                                <div className="error-btn">
                                    <NavLink to="/">Back to home page</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default P404;

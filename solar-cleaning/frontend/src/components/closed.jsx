import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import sliderImg from "../../public/slider-img.png";
import professionalImg from "../../public/professional-img.png";

import Header from "./Header";
import Footer from "./Footer";

const Closed = () => {
  const authState = useSelector((state) => state.auth);
  const actualIsAuthenticated = authState?.isAuthenticated ?? false;
  const actualUser = authState?.user ?? { username: "Guest" };
  
  return (
    <>
      {/* Basic */}
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {/* Mobile Metas */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {/* Site Metas */}
      <meta name="keywords" content="" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>TJ Solars</title>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
      />
      {/* Internal Stylesheets from Public Folder */}
      <link rel="stylesheet" href="/css/bootstrap.css" />
      <link rel="stylesheet" href="/css/font-awesome.min.css" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/responsive.css" />

      <div className="hero_area">
        <Header />
        {/* slider section */}
        <section className="slider_section">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="detail-box">
                  <h1>
                    Website production stopped due to no payment from middle man..
                  </h1>
                  
                </div>
              </div>
              <div className="col-md-6">
                <div className="img-box">
                  <img src={sliderImg} alt="Slider Image" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* end slider section */}
      </div>
      <Footer />
    </>
  );
};

export default Closed;

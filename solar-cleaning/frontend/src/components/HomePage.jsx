import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import sliderImg from "../../public/slider-img.png";
import professionalImg from "../../public/professional-img.png";

import Header from "./Header";
import Footer from "./Footer";

const HomePage = () => {
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
                    Solar Repair and <br />
                    Maintenance <br />
                    Services
                  </h1>
                  <p>
                    At TJ Solars, we provide top-notch repair and maintenance
                    services for your solar panel systems. Our experienced
                    technicians ensure that your panels operate at peak
                    efficiency, saving you money and contributing to a greener
                    planet. From routine inspections to emergency repairs, we've
                    got you covered. Trust TJ Solars for reliable and
                    professional solar panel care.
                  </p>
                  <a href="#professional_section"> Get Started </a>
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
      {/* feature section */}
      <section className="feature_section">
        <div className="container">
          <div className="feature_container">
            <Link
              to="/clients"
              className="box"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="img-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-person-arms-up"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                  <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
                </svg>
              </div>
              <h5 className="name">Clients</h5>
            </Link>
            <Link
              to={actualIsAuthenticated ? "/bookings" : "/login"}
              className="box"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="img-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="currentColor"
                  className="bi bi-bookmark-check"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
                  />
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                </svg>
              </div>
              <h5 className="name">Bookings</h5>
            </Link>
            <Link
              to="/workers"
              className="box"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="img-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-person-vcard"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                  <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
                </svg>
              </div>
              <h5 className="name">Workers</h5>
            </Link>
          </div>
        </div>
      </section>
      {/* end feature section */}
      {/* professional section */}
      <section className="professional_section layout_padding">
        <div id="professional_section" className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="img-box">
                <img src={professionalImg} alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <h2>
                  We Provide Professional <br />
                  Solar Cleaning Services.
                </h2>
                <p>
                  At TJ Solar, our expert team specializes in professional solar
                  cleaning services that ensure your solar panels operate at
                  their maximum efficiency. Regular cleaning can enhance energy
                  production and prolong the lifespan of your panels. We use
                  advanced cleaning techniques to remove dirt, debris, and
                  grime, ensuring optimal performance. Trust us to keep your
                  solar investment clean and productive.
                </p>
                <Link
                  className="nav-link"
                  to={actualIsAuthenticated ? "/bookings" : "/login"}
                >
                  Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end professional section */}
      <Footer />
    </>
  );
};

export default HomePage;

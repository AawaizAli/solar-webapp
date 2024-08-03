import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import "./ReportsPage.css";

import * as WebDataRocksReact from "@webdatarocks/react-webdatarocks";

import Header from "./Header";
import Footer from "./Footer";

const Reports2 = () => {
  const authState = useSelector((state) => state.auth);
  const actualIsAuthenticated = authState?.isAuthenticated ?? false;
  const actualUser = authState?.user;

  const [activeTab, setActiveTab] = useState("bookings");
  const pivotRef = useRef(null);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleUpload = () => {
    document.getElementById('file-upload').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File uploaded:", file);
      // Handle file upload and processing
      // Convert the file to JSON and load it into the WebDataRocks component
    }
  };

  const handleClear = () => {
    if (pivotRef.current) {
      const confirmed = window.confirm("Are you sure you want to clear the spreadsheet?");
      if (confirmed) {
        pivotRef.current.webdatarocks.setReport({
          dataSource: {
            dataSourceType: "json",
            data: [],
          },
          slice: {},
        });
      }
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="keywords" content="" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>Solar Cleaning</title>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
      />
      <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
      <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
      <link href="css/style.css" rel="stylesheet" />
      <link href="css/responsive.css" rel="stylesheet" />
      <div className="hero_area">
        <Header />
      </div>

      <div id="wdr-container" className="spreadsheet">
        <WebDataRocksReact.Pivot
          ref={pivotRef}
          toolbar={true}
          width="100%"
        //   report={{
        //     dataSource: {
        //       dataSourceType: "json",
        //       data: [],
        //     },
        //     slice: {},
        //   }}
        report="https://cdn.webdatarocks.com/reports/report.json"
          beforetoolbarcreated={(toolbar) => {
            const tabs = toolbar.getTabs();
            toolbar.getTabs = function () {
              // Add custom upload and clear buttons
              tabs.unshift(
                {
                  id: "wdr-tab-upload",
                  title: "Upload",
                  handler: handleUpload,
                  icon: this.icons.open,
                },
                {
                  id: "wdr-tab-clear",
                  title: "Clear",
                  handler: handleClear,
                  icon: this.icons.format,
                }
              );

              // Remove other unnecessary tabs
              delete tabs[2]; // Data tab
              delete tabs[3]; // Fields tab
              delete tabs[4]; // Format tab
              delete tabs[6]; // Filters tab
              delete tabs[7]; // Options tab
              delete tabs[8]; // Fullscreen tab

              return tabs;
            };
          }}
        />
      </div>

      <input
        type="file"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".xlsx, .xls, .csv"
      />

      <Footer />
    </>
  );
};

export default Reports2;

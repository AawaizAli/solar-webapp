import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Tabs } from "antd";
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

    const items = [
        { label: "Bookings", key: "bookings" },
        { label: "Salary", key: "salary" },
        { label: "Expenses", key: "expenses" },
        { label: "Daily Account", key: "dailyAccount" },
    ];

    return (
        <>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
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
            <link
                rel="stylesheet"
                type="text/css"
                href="css/font-awesome.min.css"
            />
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
                    report={{
                        dataSource: {
                            dataSourceType: "json",
                            data: [],
                        },
                        slice: {},
                    }}
                    beforetoolbarcreated={(toolbar) => {
                        const tabs = toolbar.getTabs();
                        // Customizing the save button functionality (assuming it's the 2nd tab
                        toolbar.getTabs = function () {
                            // Optionally, remove other tabs as per your needs
                 
                            return tabs;
                        };
                    }}
                />
            </div>

            <Footer />
        </>
    );
};

export default Reports2;

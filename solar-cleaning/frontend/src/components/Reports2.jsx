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
import * as XLSX from "xlsx";
import Papa from "papaparse";

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
        document.getElementById("file-upload").click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const report = transformToReport(json);
                    pivotRef.current.webdatarocks.setReport(report);
                } else if (file.name.endsWith(".csv")) {
                    Papa.parse(file, {
                        complete: (result) => {
                            const json = result.data;
                            const report = transformToReport(json);
                            pivotRef.current.webdatarocks.setReport(report);
                        },
                    });
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const transformToReport = (data) => {
        // Assume the first row contains headers and subsequent rows contain data
        if (data.length === 0) return null;

        const headers = data[0];
        const rows = data.slice(1);

        // Convert headers and rows to WebDataRocks report structure
        const columnLabels = headers.map((header) => ({
            uniqueName: header,
        }));

        const jsonData = rows.map((row) => {
            const rowData = {};
            row.forEach((cell, index) => {
                rowData[headers[index]] = cell;
            });
            return rowData;
        });

        return {
            dataSource: {
                dataSourceType: "json",
                data: jsonData,
            },
            slice: {
                rows: [], // Define rows if necessary
                columns: columnLabels,
                measures: [], // Define measures if necessary
            },
            formats: [
                {
                    name: "",
                    thousandsSeparator: " ",
                    decimalSeparator: ".",
                    decimalPlaces: 2,
                    maxSymbols: 20,
                    currencySymbol: "",
                    currencySymbolAlign: "left",
                    nullValue: " ",
                    infinityValue: "Infinity",
                    divideByZeroValue: "Infinity",
                }
            ],
        };
    };

    const handleClear = () => {
        if (pivotRef.current) {
            const confirmed = window.confirm(
                "Are you sure you want to clear the spreadsheet except for column labels?"
            );
            if (confirmed) {
                const report = pivotRef.current.webdatarocks.getReport();
                if (!report || typeof report !== "object") {
                    console.error("Unexpected report format:", report);
                    return;
                }

                const columnLabels = report.slice?.columns || [];

                console.log("Column Labels to Preserve:", columnLabels);

                pivotRef.current.webdatarocks.clear();

                const dummyData = {};
                columnLabels.forEach((col) => {
                    dummyData[col.uniqueName] = "N/A"; 
                });

                pivotRef.current.webdatarocks.setReport({
                    dataSource: {
                        dataSourceType: "json",
                        data: [dummyData], 
                    },
                    slice: {
                        rows: [], 
                        columns: columnLabels,
                        measures: report.slice?.measures || [],
                    },
                    formats: report.formats || [], 
                });
            }
        }
    };

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

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Tabs, Button } from "antd";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import "./ReportsPage.css";
import Spreadsheet from "react-spreadsheet";    
import { getAllReports, getAllBookingInstances } from "../features/reports/reportsSlice";
import Header from "./Header";
import Footer from "./Footer";

const ReportsPage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("bookings");
    const [data, setData] = useState({
        bookings: [[]],
        salary: [[]],
        expenses: [[]],
        dailyAccount: [[]],
    });

    useEffect(() => {
        if (activeTab === "bookings") {
            dispatch(getAllBookingInstances()).then((action) => {
                const payload = action.payload;
                if (payload) {
                    const sortedBookings = [...payload].sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );

                    const formattedBookings = sortedBookings.map((booking) => {
                        const dateObj = new Date(booking.date);
                        const dayOfWeek = dateObj.toLocaleDateString("en-US", {
                            weekday: "long",
                        });

                        return [
                            { value: booking.booking_id }, 
                            { value: booking.date },
                            { value: dayOfWeek },
                            { value: booking.client.name },
                            { value: booking.worker.name },
                            { value: booking.client.address }, // Client Address
                            { value: booking.client.area }, // Client Area
                            { value: booking.client.contact_details }, // Client Contact
                            { value: booking.client.total_panels }, // Total Panels
                            { value: booking.client.charge_per_clean }, // Charges per Clean
                            { value: booking.status },
                        ];
                    });

                    setData((prevData) => ({
                        ...prevData,
                        bookings: [[]].concat(formattedBookings),
                    }));
                }
            });
        } else {
            dispatch(getAllReports()).then((action) => {
                const payload = action.payload;
                if (payload) {
                    const { salaries, expenses, daily_accounts } = payload;

                    const formattedSalaries = Object.entries(salaries).flatMap(
                        ([workerName, salaryDetails]) =>
                            salaryDetails.length > 0
                                ? salaryDetails.map((salary) => [
                                      { value: salary.date },
                                      { value: salary.day },
                                      { value: salary.advance },
                                      { value: salary.incentive },
                                      { value: workerName },
                                  ])
                                : [
                                      [
                                          { value: "" },
                                          { value: "" },
                                          { value: "" },
                                          { value: "" },
                                          { value: workerName },
                                      ],
                                  ]
                    );

                    const formattedExpenses = expenses.map((expense) => [
                        { value: expense.date },
                        { value: expense.description },
                        { value: expense.amount },
                    ]);

                    const formattedDailyAccounts = daily_accounts.map((account) => [
                        { value: account.date },
                        { value: account.day },
                        { value: account.total_earnings },
                        { value: account.petrol_expense },
                        { value: account.total_daily_wage },
                        { value: account.tj_earnings_per_day },
                    ]);

                    setData({
                        bookings: [[]], // Keep this empty because it's already handled in the bookings tab
                        salary: [[]].concat(formattedSalaries),
                        expenses: [[]].concat(formattedExpenses),
                        dailyAccount: [[]].concat(formattedDailyAccounts),
                    });
                }
            });
        }
    }, [dispatch, activeTab]); // Re-run when activeTab changes

    const handleDataChange = (newData) => {
        setData((prevData) => ({
            ...prevData,
            [activeTab]: newData,
        }));
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleDownloadExcel = () => {
        if (data[activeTab] && data[activeTab].length > 1) {
            const jsonData = data[activeTab].map((row) =>
                row.map((cell) => cell.value)
            );
            const ws = XLSX.utils.aoa_to_sheet(jsonData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, `${activeTab}.xlsx`);
        } else {
            alert("No data available to download.");
        }
    };

    const handleUploadExcel = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const formattedData = json.map((row) =>
                    row.map((cell) => ({ value: cell }))
                );
                setData((prevData) => ({
                    ...prevData,
                    [activeTab]: formattedData,
                }));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleClearTable = () => {
        setData((prevData) => ({
            ...prevData,
            [activeTab]: [[]],
        }));
    };

    const handleAddRow = () => {
        setData((prevData) => ({
            ...prevData,
            [activeTab]: [
                ...prevData[activeTab],
                new Array(prevData[activeTab][0].length).fill({ value: "" }),
            ],
        }));
    };

    const handleAddColumn = () => {
        setData((prevData) => ({
            ...prevData,
            [activeTab]: prevData[activeTab].map((row) => [
                ...row,
                { value: "" },
            ]),
        }));
    };

    const columns = {
        bookings: [
            "Booking ID",
            "Date",
            "Day",
            "Client Name",
            "Worker Name",
            "Client Address", // New column
            "Client Area", // New column
            "Client Contact", // New column
            "Total Panels", // New column
            "Charges per Clean", // New column
            "Status",
        ],
        salary: ["Date", "Day", "Advance", "Incentive", "Worker Name"],
        expenses: ["Date", "Description", "Amount"],
        dailyAccount: [
            "Date",
            "Day",
            "Total Earnings",
            "Petrol Expense",
            "Total Daily Wage",
            "TJ Earnings per Day",
        ],
    };

    const renderSpreadsheet = () => (
        <Spreadsheet
            data={data[activeTab]}
            columnLabels={columns[activeTab]}
            onChange={handleDataChange}
        />
    );

    const items = [
        { label: "Bookings", key: "bookings", children: renderSpreadsheet() },
        { label: "Salary", key: "salary", children: renderSpreadsheet() },
        { label: "Expenses", key: "expenses", children: renderSpreadsheet() },
        {
            label: "Daily Account",
            key: "dailyAccount",
            children: renderSpreadsheet(),
        },
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
            <title>Reports Page</title>
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

            <Tabs
                defaultActiveKey="bookings"
                centered
                items={items}
                onChange={handleTabChange}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}>
                <Button
                    type="primary"
                    onClick={handleDownloadExcel}
                    style={{ marginRight: "10px" }}>
                    Download Excel
                </Button>
                <Button
                    type="primary"
                    onClick={() =>
                        document.getElementById("upload-excel").click()
                    }
                    style={{ marginRight: "10px" }}>
                    Upload Excel
                </Button>

                <Button
                    type="primary"
                    onClick={handleAddRow}
                    style={{ marginRight: "10px" }}>
                    Add Row
                </Button>
                <Button
                    type="primary"
                    onClick={handleAddColumn}
                    style={{ marginRight: "10px" }}>
                    Add Column
                </Button>
                <Button
                    type="default"
                    onClick={handleClearTable}
                    style={{ marginRight: "10px" }}
                    danger>
                    Clear Table
                </Button>
                <input
                    type="file"
                    id="upload-excel"
                    style={{ display: "none" }}
                    onChange={handleUploadExcel}
                    accept=".xlsx, .xls"
                />
            </div>

            <Footer />
        </>
    );
};

export default ReportsPage;

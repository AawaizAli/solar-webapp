import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import "./ReportsPage.css";
import Spreadsheet from "react-spreadsheet";
import { getAllReports } from "../features/reports/reportsSlice";

import Header from "./Header"
import Footer from "./Footer"

const ReportsPage = () => {
    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    console.log(authState?.isAuthenticated);
    const actualUser = authState?.user;

    const dispatch = useDispatch();
    const dataTest = useSelector((state) => state);
    console.log(dataTest, "dataTestdataTestdataTest");
    const [activeTab, setActiveTab] = useState("schedule");
    const [data, setData] = useState({
        schedule: [],
        salary: [],
        expenses: [],
        dailyAccount: [],
    });
    const [originalData, setOriginalData] = useState({
        schedule: [],
        salary: [],
        expenses: [],
        dailyAccount: [],
    });
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        dispatch(getAllReports()).then((action) => {
            const payload = action.payload;
            if (payload) {
                const { bookings, salaries, expenses, daily_accounts } =
                    payload;
                console.log("Fetched bookings:", bookings);
                console.log("Fetched salaries:", salaries);
                console.log("Fetched expenses:", expenses);
                console.log("Fetched daily_accounts:", daily_accounts);

                const formattedSchedules = bookings.map((booking) => {
                    const dateObj = new Date(booking.date);
                    const dayOfWeek = dateObj.toLocaleDateString("en-US", {
                        weekday: "long",
                    });

                    return [
                        { value: booking.date },
                        { value: dayOfWeek },
                        { value: booking.client.name },
                        { value: booking.worker.name },
                        { value: booking.client.address },
                        { value: booking.client.area },
                        { value: booking.client.contact_details },
                        { value: booking.client.total_panels },
                        { value: booking.client.charge_per_clean },
                        { value: booking.status },
                    ];
                });
                console.log("Formatted schedules:", formattedSchedules);

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
                console.log("Formatted salaries:", formattedSalaries);

                const formattedExpenses = expenses.map((expense) => [
                    { value: expense.date },
                    { value: expense.description },
                    { value: expense.amount },
                ]);
                console.log("Formatted expenses:", formattedExpenses);

                const formattedDailyAccounts = daily_accounts.map((account) => [
                    { value: account.date },
                    { value: account.day },
                    { value: account.total_earnings },
                    { value: account.petrol_expense },
                    { value: account.total_daily_wage },
                    { value: account.tj_earnings_per_day },
                ]);
                console.log(
                    "Formatted daily accounts:",
                    formattedDailyAccounts
                );

                setData({
                    schedule: formattedSchedules,
                    salary: formattedSalaries,
                    expenses: formattedExpenses,
                    dailyAccount: formattedDailyAccounts,
                });
                setOriginalData({
                    schedule: formattedSchedules,
                    salary: formattedSalaries,
                    expenses: formattedExpenses,
                    dailyAccount: formattedDailyAccounts,
                });
            }
        });
    }, [dispatch]);

    const handleDataChange = (newData) => {
        setData((prevData) => ({
            ...prevData,
            [activeTab]: newData,
        }));
        setIsChanged(true);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setIsChanged(false);
        setOriginalData(data);
    };

    const handleSave = () => {
        // Save data to the backend
        console.log("Data saved:", data[activeTab]);
        setIsChanged(false);
    };

    const handleCancel = () => {
        setData(originalData);
        setIsChanged(false);
    };

    const columns = {
        schedule: [
            "Date",
            "Day",
            "Client Name",
            "Worker Name",
            "Address",
            "Area",
            "Client Contact",
            "Total Panels",
            "Charges per Clean",
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
        { label: "Schedule", key: "schedule", children: renderSpreadsheet() },
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
            {/* Basic */}
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <meta name="keywords" content="" />
            <meta name="description" content="" />
            <meta name="author" content="" />
            <title>SolarPod</title>
            {/* slider stylesheet */}
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
            />
            {/* bootstrap core css */}
            <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
            {/* font awesome style */}
            <link
                rel="stylesheet"
                type="text/css"
                href="css/font-awesome.min.css"
            />
            {/* Custom styles for this template */}
            <link href="css/style.css" rel="stylesheet" />
            {/* responsive style */}
            <link href="css/responsive.css" rel="stylesheet" />
            <div className="hero_area">
                {/* header section strats */}
                <Header></Header>
                {/* end header section */}
            </div>

            {/* Reports Section */}
            <Tabs
                defaultActiveKey="schedule"
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
                    onClick={handleSave}
                    disabled={!isChanged}
                    style={{ marginRight: "10px" }}>
                    Save
                </Button>
                <Button onClick={handleCancel} disabled={!isChanged}>
                    Cancel
                </Button>
            </div>

            {/* info section */}
            <Footer></Footer>
        </>
    );
};

export default ReportsPage;

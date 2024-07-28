import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Button } from 'antd';
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import "./ReportsPage.css";
import Spreadsheet from "react-spreadsheet";
import { getAllReports } from "../features/reports/reportsSlice";

const ReportsPage = () => {
    const dispatch = useDispatch();
    const { schedule, salary, expenses, dailyAccount, loading, error } = useSelector((state) => state.reports);

    const [activeTab, setActiveTab] = useState("schedule");
    const [data, setData] = useState({ schedule: [], salary: [], expenses: [], dailyAccount: [] });
    const [originalData, setOriginalData] = useState({ schedule: [], salary: [], expenses: [], dailyAccount: [] });
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        dispatch(getAllReports()).then((action) => {
            const payload = action.payload;
            if (payload) {
                const { bookings, salaries, expenses, daily_accounts } = payload;
                console.log('Fetched bookings:', bookings);
                console.log('Fetched salaries:', salaries);
                console.log('Fetched expenses:', expenses);
                console.log('Fetched daily_accounts:', daily_accounts);

                const formattedSchedules = bookings.map(booking => [
                    { value: booking.date },
                    { value: booking.day },
                    { value: booking.client.name },
                    { value: booking.worker.name },
                    { value: booking.client.address },
                    { value: booking.client.area },
                    { value: booking.client.contact_details },
                    { value: booking.client.total_panels },
                    { value: booking.client.charge_per_clean },
                    { value: booking.status }
                ]);
                console.log('Formatted schedules:', formattedSchedules);

                const formattedSalaries = Object.entries(salaries).flatMap(([workerName, salaryDetails]) =>
                    salaryDetails.length > 0
                        ? salaryDetails.map(salary => [
                            { value: salary.date },
                            { value: salary.day },
                            { value: salary.advance },
                            { value: salary.incentive },
                            { value: workerName }
                        ])
                        : [[{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: workerName }]]
                );
                console.log('Formatted salaries:', formattedSalaries);

                const formattedExpenses = expenses.map(expense => [
                    { value: expense.date },
                    { value: expense.description },
                    { value: expense.amount }
                ]);
                console.log('Formatted expenses:', formattedExpenses);

                const formattedDailyAccounts = daily_accounts.map(account => [
                    { value: account.date },
                    { value: account.day },
                    { value: account.total_earnings },
                    { value: account.petrol_expense },
                    { value: account.total_daily_wage },
                    { value: account.tj_earnings_per_day }
                ]);
                console.log('Formatted daily accounts:', formattedDailyAccounts);

                setData({
                    schedule: formattedSchedules,
                    salary: formattedSalaries,
                    expenses: formattedExpenses,
                    dailyAccount: formattedDailyAccounts
                });
                setOriginalData({
                    schedule: formattedSchedules,
                    salary: formattedSalaries,
                    expenses: formattedExpenses,
                    dailyAccount: formattedDailyAccounts
                });
            }
        });
    }, [dispatch]);

    const handleDataChange = (newData) => {
        setData((prevData) => ({
            ...prevData,
            [activeTab]: newData
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
        schedule: ["Date", "Day", "Client Name", "Worker Name", "Address", "Area", "Client Contact", "Total Panels", "Charges per Clean", "Status"],
        salary: ["Date", "Day", "Advance", "Incentive", "Worker Name"],
        expenses: ["Date", "Description", "Amount"],
        dailyAccount: ["Date", "Day", "Total Earnings", "Petrol Expense", "Total Daily Wage", "TJ Earnings per Day"]
    };

    const renderSpreadsheet = () => (
        <Spreadsheet
            data={data[activeTab]}
            columnLabels={columns[activeTab]}
            onChange={handleDataChange}
            style={{ margin: '20px' }}
        />
    );

    const items = [
        { label: "Schedule", key: "schedule", children: renderSpreadsheet() },
        { label: "Salary", key: "salary", children: renderSpreadsheet() },
        { label: "Expenses", key: "expenses", children: renderSpreadsheet() },
        { label: "Daily Account", key: "dailyAccount", children: renderSpreadsheet() },
    ];

    return (
        <>
            {/* Basic */}
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
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
                <header className="header_section">
                    <div className="header_top">
                        <div className="container-fluid">
                            <div className="contact_nav">
                                <a href="">
                                    <i className="header-icon fa fa-phone" aria-hidden="true" />
                                    <span> Call : +92 3302061260</span>
                                </a>
                                <a href="">
                                    <i className="fa fa-envelope" aria-hidden="true" />
                                    <span> Email : tjsolarinfo@gmail.com </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="header_bottom">
                        <div className="container-fluid">
                            <nav className="navbar navbar-expand-lg custom_nav-container">
                                <a className="navbar-brand" href="/">
                                    <span> TJ Solars </span>
                                </a>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span className=""> </span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">Home</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/bookings">Bookings</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/workers">Workers</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/clients">Clients</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/search">Search</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/reports">Reports</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/logout">Logout</a>
                                        </li>
                                        <li className="nav-item">
                                            <span className="nav-link">Welcome, Guest</span>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </header>
                {/* end header section */}
            </div>

            {/* Reports Section */}
            <Tabs
                defaultActiveKey="schedule"
                centered
                items={items}
                onChange={handleTabChange}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <Button type="primary" onClick={handleSave} disabled={!isChanged} style={{ marginRight: '10px' }}>
                    Save
                </Button>
                <Button onClick={handleCancel} disabled={!isChanged}>
                    Cancel
                </Button>
            </div>

            {/* info section */}
            <section className="info_section">
                <div className="container">
                    <h4>Get In Touch</h4>
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="info_items">
                                <div className="row">
                                    <div className="col-md-4">
                                        <a href="">
                                            <div className="item">
                                                <div className="img-box">
                                                    <i className="fa fa-map-marker" aria-hidden="true" />
                                                </div>
                                                <p>
                                                    A56, X.1, Gulshan e Maymar, Karachi, Pakistan
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-md-4">
                                        <a href="">
                                            <div className="item">
                                                <div className="img-box">
                                                    <i className="fa fa-phone" aria-hidden="true" />
                                                </div>
                                                <p>03153738555</p>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-md-4">
                                        <a href="">
                                            <div className="item">
                                                <div className="img-box">
                                                    <i className="fa fa-envelope" aria-hidden="true" />
                                                </div>
                                                <p>tjsolarinfo@gmail.com</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* end info section */}
            {/* footer section */}
            <footer className="footer_section">
                <div className="container">
                    <p>
                        © <span id="displayDateYear" /> All Rights Reserved By
                        <a href="https://www.behance.net/aawaizali">TJ Solars</a>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default ReportsPage;

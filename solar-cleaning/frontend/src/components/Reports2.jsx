import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Tabs } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import "./ReportsPage.css";
import Header from "./Header";
import Footer from "./Footer";
import Spreadsheet from "react-spreadsheet";

const Reports2 = () => {
    // Initial dummy data
    const initialData = [
        [{ value: "ID" }, { value: "Name" }, { value: "Department" }, { value: "Monthly Sales" }, { value: "Performance Rating" }],
        [{ value: 1 }, { value: "John Doe" }, { value: "Sales" }, { value: 5000 }, { value: "A" }],
        [{ value: 2 }, { value: "Jane Smith" }, { value: "Marketing" }, { value: 4500 }, { value: "B" }],
        [{ value: 3 }, { value: "Mike Johnson" }, { value: "HR" }, { value: 3000 }, { value: "C" }],
        [{ value: 4 }, { value: "Emily Davis" }, { value: "IT" }, { value: 7000 }, { value: "A" }],
    ];

    const [data, setData] = useState(initialData); // State to hold spreadsheet data
    const [size, setSize] = useState('large'); // State to hold size of tabs
    const [activeTab, setActiveTab] = useState("bookings");
    const [isChanged, setIsChanged] = useState(false);

    const columns = {
        bookings: [
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
        salary: [
            "Date", "Day", "Advance", "Incentive", "Worker Name"
        ],
        expenses: [
            "Date", "Description", "Amount"
        ],
        revenue: [
            "Date",
            "Day",
            "Total Earnings",
            "Petrol Expense",
            "Total Daily Wage",
            "TJ Earnings per Day",
        ],
    };


    // Function to convert JSON data to spreadsheet format
    const convertJsonToSpreadsheetData = (jsonData) => {
        const headers = Object.keys(jsonData[0]); // Extract headers from JSON
        const spreadsheetData = [headers].concat(
            jsonData.map((row) => headers.map((header) => ({ value: row[header] }))) // Map JSON data to spreadsheet format
        );
        return spreadsheetData;
    };

    // Function to save data to localStorage
    const saveDataToLocalStorage = (data) => {
        const stringifiedData = JSON.stringify(data);
        localStorage.setItem("spreadsheetData", stringifiedData);
    };

    // Function to load data from localStorage
    const loadDataFromLocalStorage = () => {
        const savedData = localStorage.getItem("spreadsheetData");
        return savedData ? JSON.parse(savedData) : initialData;
    };

    // Function to handle file upload and parse it to spreadsheet data
    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                    const workbook = XLSX.read(data, { type: "array" }); // Read Excel file
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON
                    const formattedData = json.map((row) => row.map((cell) => ({ value: cell })));
                    setData(formattedData); // Update state
                    saveDataToLocalStorage(formattedData); // Save data to localStorage
                } else if (file.name.endsWith(".csv")) {
                    Papa.parse(file, {
                        complete: (result) => {
                            const json = result.data;
                            const formattedData = json.map((row) => row.map((cell) => ({ value: cell })));
                            setData(formattedData); // Update state
                            saveDataToLocalStorage(formattedData); // Save data to localStorage
                        },
                    });
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Function to trigger file input click
    const handleFileClick = () => {
        document.getElementById("file-upload").click();
    };

    // Function to download the current spreadsheet data as an Excel file
    const handleDownload = () => {
        if (data && data.length > 0) {
            const jsonData = data.map((row) => row.map((cell) => cell.value)); // Extract values

            const ws = XLSX.utils.aoa_to_sheet(jsonData); // Convert to worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Append worksheet to workbook
            XLSX.writeFile(wb, "spreadsheet.xlsx"); // Write file
        } else {
            alert("No data available to download."); // Alert if no data
        }
    };

    // Function to handle updating spreadsheet data (can be used for user input)
    const handleUpdate = () => {
        const updatedData = data.map((row) => row.map((cell) => cell.value)); // Extract values
        setData(updatedData.map((row) => row.map((cell) => ({ value: cell })))); // Update state
        saveDataToLocalStorage(updatedData.map((row) => row.map((cell) => ({ value: cell })))); // Save to localStorage
    };

    // Function to clear the spreadsheet data
    const handleClear = () => {
        setData([[]]); // Clear data
        localStorage.removeItem("spreadsheetData"); // Clear localStorage
    };

    useEffect(() => {
        const savedData = loadDataFromLocalStorage(); // Load data from localStorage
        setData(savedData);
    }, []);

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
        { label: "Revenue", key: "revenue", children: renderSpreadsheet() },
    ];

    return (
        <>
            {/* Meta tags and stylesheet links for the page */}
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="keywords" content="" />
            <meta name="description" content="" />
            <meta name="author" content="" />
            <title>Solar Cleaning</title>
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
            <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
            <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
            <link href="css/style.css" rel="stylesheet" />
            <link href="css/responsive.css" rel="stylesheet" />
            <div className="hero_area">
                <Header />
            </div>

            {/* Ant Design Tabs for different sections */}
            <div className="container mt-4">
                <Tabs
                    defaultActiveKey="1"
                    size={size}
                    style={{ marginBottom: 32 }}
                    items={items}
                />
            </div>

            {/* Container with buttons for uploading, updating, downloading, and clearing spreadsheet data */}
            <div className="container mt-4">
                <button onClick={handleFileClick} className="btn btn-primary mr-2">
                    Upload Excel File
                </button>
                <button onClick={handleUpdate} className="btn btn-warning mr-2">
                    Update Spreadsheet
                </button>
                <button onClick={handleDownload} className="btn btn-success mr-2">
                    Download Excel File
                </button>
                <button onClick={handleClear} className="btn btn-danger">
                    Clear Spreadsheet
                </button>

                {/* Hidden file input for uploading files */}
                <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleUpload}
                    accept=".xlsx, .xls, .csv"
                />
            </div>

            {/* Displaying the spreadsheet component */}
            <div id="spread-container" className="spreadsheet mt-4">
                <Spreadsheet data={data} onChange={setData} />
            </div>

            <Footer />
        </>
    );
};

export default Reports2;

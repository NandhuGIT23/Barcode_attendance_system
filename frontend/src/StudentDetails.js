import React, { useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

import "./App.css";

const StudentDetails = () => {
  const lateralEntry = [
    "22ECEBE224",
    "22ECEBE211",
    "22ECEBE210",
    "22ECEBE218",
    "22ECEBE217",
    "22ECEBE216",
    "22ECEBE221",
    "22ECEBE220",
    "22ECEBE223",
    "22ECEBE222",
    "22ECEBE215",
    "22ECEBE227",
    "22ECEBE226",
    "21ECEBE239",
    "21ECEBE229",
    "21ECEBE245",
    "21ECEBE231",
    "21ECEBE241",
    "21ECEBE230",
    "21ECEBE240",
    "21ECEBE238",
    "21ECEBE243",
    "21ECEBE246",
    "21ECEBE244",
    "21ECEBE236",
    "21ECEBE223",
    "21ECEBE237",
  ];
  const [barcode, setBarcode] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  // const [error, setError] = useState(null);

  const handleSearch = async (bar) => {
    console.log(barcode);
    const currentTimeIST = moment().tz("Asia/Kolkata").format();
    // console.log(currentTimeIST.toString());

    try {
      const response = await axios.get(`https://barcode-attendance-system.onrender.com/student/${bar}`);
      // const response = await axios.get(`http://localhost:5000/student/${bar}`);
      setStudent(response.data);
      setError(null);

      // Send search details to the server
      await axios.post("https://barcode-attendance-system.onrender.com/entry", {
      // await axios.post("http://localhost:5000/entry", {
        barcode: response.data.barcode,
        name: response.data.name,
        course: response.data.course,
        dept: response.data.dept,
        section: response.data.section,
        semester: response.data.semester,
        register_number: response.data.register_number,
        entryAt: currentTimeIST,
      });
      setBarcode("");
    } catch (error) {
      setBarcode("");
      setError("Student not found");
      setStudent(null);
    }
  };

  return (
    <div className="container-1">
      <button className="report_btn">
        <Link style={{ textDecoration: "none", color: "black" }} to="/report">
          Report
        </Link>
      </button>

      <div className="input-group">
        <h1>Student Details</h1>
        <input
          autoFocus
          style={{ width: "70%" }}
          type="text"
          placeholder="Enter Barcode"
          value={barcode}
          onChange={(e) => {
            var bar = e.target.value;
            setBarcode(bar);
            if (bar.length === 10) {
              if (lateralEntry.includes(bar.slice(0, 10))) {
                handleSearch(bar + "L");
              } else {
                handleSearch(bar);
              }
            }
          }}
        />
        {/* <button onClick={handleSearch} className="button primary">
          Search
        </button> */}
        {error && <p>{error}</p>}
        {student && (
          <div>
            <h3>Name : {student.name}</h3>
            <h3>Admission no : {student.barcode}</h3>
            <h3>Register no : {student.register_number}</h3>
            <h3>Semester : {student.semester}</h3>
            <h3>Dept : {student.dept}</h3>
            <h3>Section : {student.section}</h3>
            <h3>
              Entry Date : {moment().tz("Asia/Kolkata").format().slice(0, 10)}
            </h3>
            <h3>
              Entry Time : {moment().tz("Asia/Kolkata").format().slice(11, 19)}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;

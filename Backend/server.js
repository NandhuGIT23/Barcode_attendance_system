require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// const moment = require("moment-timezone");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to db & listening on port 5000!!!");
    });
  })
  .catch((error) => {
    console.log(error);
  });

// const StudentSchema = new mongoose.Schema({
//   barcode: { type: String, required: true },
//   name: { type: String, required: true },
//   semester: { type: Number, required: true },
//   dept: { type: String, required: true },
//   course: { type: String, required: true },
//   section: { type: String, required: true },
//   register_number: { type: Number, required: true },
// });

// const SearchSchema = new mongoose.Schema(
//   {
//     barcode: { type: String, required: true },
//     name: { type: String, required: true },
//     semester: { type: Number, required: true },
//     dept: { type: String, required: true },
//     course: { type: String, required: true },
//     section: { type: String, required: true },
//     register_number: { type: Number, required: true },
//     entryAt: { type: String, required: true },
//   },
//   { timestamps: false }
// );

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("ece_entry"); // Get the connected database
const Student_collection = db.collection("students"); // Specify the collection name
const Search_collection = db.collection("searches"); // Specify the collection name

// const Student = mongoose.model("Student", StudentSchema);
// const Search = mongoose.model("Search", SearchSchema);

// Endpoint to get student details by barcode number
app.get("/student/:barcode", async (req, res) => {
  try {
    // const student = await Student.findOne({ barcode: req.params.barcode });
    const student = await Student_collection.findOne({
      barcode: req.params.barcode,
    });
    console.log(student);
    if (!student) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
    console.log("Student found");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Endpoint to store search details
app.post("/entry", async (req, res) => {
  try {
    const {
      barcode,
      name,
      dept,
      course,
      section,
      semester,
      register_number,
      entryAt,
    } = req.body;
    console.log("one");
    const newSearch = {
      barcode,
      name,
      semester,
      dept,
      course,
      section,
      register_number,
      entryAt,
    };
    const result = await Search_collection.insertOne(newSearch);
    console.log("Entry successful");
    res.status(201).json({ message: "Search details saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Endpoint to handle filter requests
app.get("/filter", async (req, res) => {
  const selectedDate = req.query.date;
  const dateParam = req.query.date;
  const regexDate = new RegExp("^" + dateParam);

  console.log(selectedDate);
  // const startDateIST = moment(selectedDate)
  //   .startOf("day")
  //   .tz("Asia/Kolkata")
  //   .toDate();
  // const endDateIST = moment(selectedDate)
  //   .endOf("day")
  //   .tz("Asia/Kolkata")
  //   .toDate();
  // console.log(startDateIST, endDateIST);

  const data = await Search_collection.find({ entryAt: regexDate }).toArray();
  // console.log(data); // This will log the fetched data
  res.json(data);
  // await Search_collection.find({ entryAt: regexDate })
  //   .then(function (data) {
  //     console.log(data); // This will log the fetched data
  //     res.json(data);
  //   })
  //   .catch(function (err) {
  //     console.error(err);
  //   });
});
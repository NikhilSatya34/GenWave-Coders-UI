const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// CONNECT TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/genwave_db")
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log(err));


// ===================== CONTACT FORM =====================

// UPDATED CONTACT SCHEMA (Added rollNumber)
const contactSchema = new mongoose.Schema({
    name: String,
    rollNumber: String,   // <-- NEW FIELD
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

// MODEL
const Contact = mongoose.model("Contact", contactSchema);

// POST API — STORE CONTACT MESSAGE
app.post("/api/contact", async (req, res) => {
    try {
        const { name, rollNumber, email, message } = req.body;  // <-- include rollNumber

        const newMessage = new Contact({
            name,
            rollNumber,  // <-- store roll number
            email,
            message
        });

        await newMessage.save();

        res.json({ success: true, message: "Message stored successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to store message." });
    }
});

// GET API — FETCH ALL CONTACT MESSAGES
app.get("/api/contact/messages", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json({ success: true, data: messages });

    } catch (error) {
        res.json({ success: false, message: "Unable to fetch messages" });
    }
});


// ===================== START SERVER =====================
app.listen(5000, () => {
    console.log("API Running on http://localhost:5000");
});

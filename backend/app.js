const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();

app.use(cors());
app.use(express.json());









const connectDB = require("./connection/connection");



//creating port
// Ensure the database is connected before starting the server
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started at port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database", error);
});

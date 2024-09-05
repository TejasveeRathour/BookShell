const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();

app.use(cors());
app.use(express.json());

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Payment = require("./routes/payment");

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

//routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1", Payment);
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cors = require('cors');

app.use(
    cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://sisgb.vercel.app'] })
);

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json(
        {
            "message": "Welcome to SisGB!"
        }
    );
});

const bookRoutes = require("./api/routes/bookRoutes");
app.use("/book", bookRoutes);
const userRoutes = require("./api/routes/userRoutes");
app.use("/user", userRoutes);
const loanRoutes = require("./api/routes/loanRoutes");
app.use("/loan", loanRoutes);
const reservationRoutes = require("./api/routes/reservationRoutes");
app.use("/reservation", reservationRoutes);

mongoAtlasUri = process.env.MONGO_ATLAS_URI;

mongoose.set("strictQuery", false);
mongoose.connect(mongoAtlasUri)
    .then(() => {
        app.listen(port, () => {
            console.log(`Connected with MongoDB!\nSisGB App listening on port ${port}...`);
        });
    })
    .catch((err) => {
        console.log(err)
    });

module.exports = app;
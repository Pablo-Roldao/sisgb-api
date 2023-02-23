const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;

app.use(logger);

const whiteList = ['https://sisgb.vercel.app', 'http://127.0.0.1:3000', 'http://localhost:3000'];
const corsOptions = {
    origin: {
        origin: (origin, callback) => {
            if (whiteList.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        optionsSuccessStatus: 200
    }
}
app.use(cors(corsOptions));


app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json()); ""

app.get("/", (req, res) => {
    res.status(200).json(
        {
            "message": "Welcome to SisGB!"
        }
    );
});

app.use("/book", require("./api/routes/bookRoutes"));
app.use("/user", require("./api/routes/userRoutes"));
app.use("/loan", require("./api/routes/loanRoutes"));
app.use("/reservation", require("./api/routes/reservationRoutes"));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

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
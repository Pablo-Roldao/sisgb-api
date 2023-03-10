const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials')
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());


app.use("/", require("./routes/root"));

app.use("/book", require("./routes/api/book"));
app.use("/user", require("./routes/api/user"));

app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/loan", require("./routes/api/loan"));
app.use("/reservation", require("./routes/api/reservation"));


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
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        userCpf: String,
        bookIsbn: String,
        startDate: Date,
        finishDate: Date
    },
    {
        versionKey: false
    }
);

const reservation = mongoose.model("Reservation", reservationSchema);

module.exports = reservation;
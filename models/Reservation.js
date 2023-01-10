const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        userCpf: String,
        bookIsbn: String,
        date: Date,
        expirationDate: Date
    },
    {
        versionKey: false
    }
);

const reservation = mongoose.model("Reservation", reservationSchema);

module.exports = reservation;
const mongoose = require("mongoose");

const archivedReservationSchema = new mongoose.Schema(
    {
        userCpf: String,
        bookIsbn: String,
        date: Date,
        expirationDate: Date,
        deletionDate: Date
    },
    {
        versionKey: false
    }
);

const ArchivedReservation = mongoose.model("Deleted reservation", archivedReservationSchema);

module.exports = ArchivedReservation;
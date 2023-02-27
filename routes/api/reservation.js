const express = require("express");
const router = require("express").Router();
const reservationController = require('../../controllers/reservationController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.route('/')
    .get(reservationController.getAll)
    .post(reservationController.register)
    .put(reservationController.update);

router.route('/get-by-id')
    .get(reservationController.getById);

router.route('/delete')
    .post(reservationController.deleteById);

router.route('/transform')
    .post(reservationController.tranformInLoan);

module.exports = router;
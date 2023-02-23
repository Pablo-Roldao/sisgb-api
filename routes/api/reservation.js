const express = require("express");
const router = require("express").Router();
const reservationController = require('../../controllers/reservationController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.route('/')
    .get(reservationController.getAll)
    .post(reservationController.register)
    .put(reservationController.update)
    .delete(reservationController.deleteById);

router.route('/:id')
.get(reservationController.getById);

module.exports = router;
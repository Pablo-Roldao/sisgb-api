const express = require("express");
const router = require("express").Router();
const loanController = require('../../controllers/loanController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(loanController.getAll)
    .post(loanController.register)
    .put(loanController.update);

router.route("/get-by-id")
    .get(loanController.getById);

router.route("/delete")
    .post(loanController.deleteById);

module.exports = router;
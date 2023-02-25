const express = require("express");
const router = require("express").Router();
const loanController = require('../../controllers/loanController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(loanController.getAll)
    .post(loanController.register)
    .put(loanController.update)
    .delete(loanController.deleteById);

router.route("/get-by-id")
    .get(loanController.getById);

module.exports = router;
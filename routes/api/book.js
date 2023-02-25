const express = require("express");
const router = require("express").Router();
const bookController = require("../../controllers/bookController");
const verifyJWT = require("../../middleware/verifyJWT");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(bookController.getAll)
    .post(bookController.register)
    .put(bookController.update)
    .delete(bookController.deleteByIsbn);

router.route('/get-by-isbn')
    .get(bookController.getByIsbn);

module.exports = router;
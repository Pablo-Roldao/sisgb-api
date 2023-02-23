const express = require("express");
const router = require("express").Router();
const bookController = require("../../controllers/bookController");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(bookController.getAll)
    .post(bookController.register)
    .put(bookController.updateByIsbn)
    .delete(bookController.deleteByIsbn);

router.route('/:isbn')
    .get(bookController.getByIsbn);

module.exports = router;
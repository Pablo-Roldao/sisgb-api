const express = require("express");
const router = require("express").Router();
const bookController = require("../../controllers/bookController");
const verifyJWT = require("../../middleware/verifyJWT");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(bookController.getAll)
    .post(verifyJWT, bookController.register)
    .put(verifyJWT, bookController.updateByIsbn)
    .delete(verifyJWT, bookController.deleteByIsbn);

router.route('/:isbn')
    .get(bookController.getByIsbn);

module.exports = router;
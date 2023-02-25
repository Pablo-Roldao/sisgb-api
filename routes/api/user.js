const express = require("express");
const router = require("express").Router();
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(userController.getAll)
    .post(userController.register)
    .put(userController.update)
    .delete(userController.deleteByCpf);

router.route('/get-by-cpf')
    .get(userController.getByCpf);

module.exports = router;
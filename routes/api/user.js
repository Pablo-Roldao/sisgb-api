const express = require("express");
const router = require("express").Router();
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(verifyJWT, userController.getAll)
    .post(userController.register)
    .put(verifyJWT, userController.update);

router.route('/get-by-cpf')
    .post(verifyJWT, userController.getByCpf);

router.route('/delete')
    .post(verifyJWT, userController.deleteByCpf);

module.exports = router;
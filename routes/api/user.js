const express = require("express");
const router = require("express").Router();
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(verifyJWT, userController.getAll)
    .post(userController.register)
    .put(verifyJWT, userController.update)
    .delete(verifyJWT, userController.deleteByCpf);

router.route('/:cpf')
    .get(verifyJWT, userController.getByCpf);

module.exports = router;
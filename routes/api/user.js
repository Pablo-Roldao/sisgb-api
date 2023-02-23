const express = require("express");
const router = require("express").Router();
const userController = require('../../controllers/userController');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/')
    .get(userController.getAll)
    .post(userController.register)
    .put(userController.update)
    .delete(userController.deleteByCpf);

router.route('/:cpf')
    .get(userController.getByCpf);

module.exports = router;
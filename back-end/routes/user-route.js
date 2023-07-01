const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const UsersController = require("../controllers/user-controller");

router.post("/signup", [
    check("name")
    .not()
    .isEmpty(),
    check("email")
    .normalizeEmail()
    .isEmail(),
    check("password")
    .isLength({ min: 6 }),
], UsersController.signup);
router.post("/login", UsersController.login);
router.patch("/:userid",[
    check("name")
    .not()
    .isEmpty()
] , UsersController.updateUser);
router.delete("/:userid", UsersController.deleteUser);

module.exports = router;


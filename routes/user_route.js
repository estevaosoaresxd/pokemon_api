const express = require("express");
const router = express.Router();
const AuthServices = require("../services/auth_services");
const UserController = require("../controller/user_controller");

router.post("/", UserController.createUser);

router.post("/auth", UserController.authUser);

router.post(
  "/admin",
  AuthServices.validateToken,
  AuthServices.validateAdmin,
  UserController.createUserAdmin
);

router.get(
  "/:id",
  AuthServices.validateToken,
  AuthServices.validateAdmin,
  AuthServices.validId,
  UserController.getByIdUser
);

router.get(
  "/username/:username",
  AuthServices.validateToken,
  AuthServices.validateAdmin,
  AuthServices.validUsername,
  UserController.getByUsername
);

router.put(
  "/:id",
  AuthServices.validateToken,
  AuthServices.validId,
  UserController.updateUserById
);

router.put(
  "/admin/:id",
  AuthServices.validateToken,
  AuthServices.validateAdmin,
  AuthServices.validId,
  UserController.updateUserAdminById
);

router.delete(
  "/:id",
  AuthServices.validateToken,
  AuthServices.validateAdmin,
  AuthServices.validId,
  UserController.deleteUserAdminById
);

module.exports = router;

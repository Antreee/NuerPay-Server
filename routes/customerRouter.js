const router = require("express").Router();
const UserController = require("../controllers/userController");
const AuthController = require("../controllers/authController");

// router.post("/", UserController.createUser);
// router.post("/login", AuthController.login);
// router.get("/", UserController.fetchUsers);
router.post("/orders", UserController.order);
// router.get("/orders", UserController.fetchOrder);
// router.get("/:id", UserController.findUser);
// router.delete("/:id", UserController.deleteUser);
// router.put("/:id", UserController.updateUser);

module.exports = router;

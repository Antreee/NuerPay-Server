const router = require("express").Router();
const routerAdmin = require("./adminRouter");
const routerCustomer = require("./customerRouter");
const routerRestaurant = require("./restaurantRouter");
const routerOrder = require("./orderRouter");
const routerXendit = require("./xenditRouter");

router.use("/admin", routerAdmin);
router.use("/customers", routerCustomer);
router.use("/restaurants", routerRestaurant);

router.use("/orders", routerOrder);
router.use("/xendit", routerXendit);

module.exports = router;

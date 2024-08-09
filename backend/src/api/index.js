const express = require("express");

const auth = require("./auth/auth.routes");
const users = require("./users/users.routes");
const events = require("./events/events.routes");
const book = require("./book/book.routes");
const admin = require("./admin/admin.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/events", events);
router.use("/book", book);
router.use("/admin", admin);

module.exports = router;

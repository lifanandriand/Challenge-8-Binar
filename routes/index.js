const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const passport = require('../lib/passport')

router.get("/",(req,res) => {
    res.status(200).json({
        status: true,
        message:"Selamat datang!"
    })
    return
})
const user = require("./user");
router.use("/users", user);

const biodata = require("./biodata");
router.use("/biodata",[passport.authenticate('jwt', { session: false })], biodata);

const media = require("./media");
router.use("/media",[passport.authenticate('jwt', { session: false })], media);

const history = require("./history");
router.use("/histories",[passport.authenticate('jwt', { session: false })], history);

module.exports = router;
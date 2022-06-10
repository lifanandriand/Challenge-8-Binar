const express = require("express");
const router = express.Router();

const {
  createBiodata,
  getBiodata,
  getAllBiodata,
  updateBiodata,
} = require("../controllers/biodata");

router.post("/", createBiodata);
router.get("/", getAllBiodata);
router.get("/:id", getBiodata);
router.put("/:id", updateBiodata);
router.delete("/:id", deleteBiodata);

module.exports = router;
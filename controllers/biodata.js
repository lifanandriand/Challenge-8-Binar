const { Biodata, User } = require("../models");

createBiodata = async (req, res) => {
  try {
    let { name, age, user_id } = req.body;

    let userExists = await User.findOne({
      where: { id: user_id },
    });

    let biodataExists = await Biodata.findOne({
      where: { user_id: user_id },
    });

    if (!userExists) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (biodataExists) {
      return res.status(400).json({
        status: "error",
        message: "Biodata already exists",
      });
    }

    if (!name || !age || !user_id) {
      return res.status(400).json({
        status: "Error",
        message: "Please fill all the fields",
        data: null,
      });
    }

    let newBiodata = await Biodata.create({
      name,
      age,
      user_id,
    });

    return res.status(201).json({
      status: "Success",
      message: "Biodata created successfully",
      data: newBiodata,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

getAllBiodata = async (req, res) => {
  try {
    let bios = await Biodata.findAll({
      include:"user"
    });

    return res.status(200).json({
      status: "Success",
      message: "Bios retrieved successfully",
      data: bios,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

getBiodata = async (req, res) => {
  try {
    let { id } = req.params;

    let bio = await Biodata.findOne({
      where: { id }
    });

    if (!bio) {
      return res.status(404).json({
        status: "Error",
        message: "Biodata not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Bio retrieved successfully",
      data: bio,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

updateBiodata = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, age } = req.body;

    let bio = await Biodata.findOne({
      where: { id },
    });

    if (!bio) {
      return res.status(404).json({
        status: "Error",
        message: "Bio not found",
      });
    }

    if (name) bio.name = name;
    if (age) bio.age = age;

    let updated = await bio.update({
      name,
      age,
    });

    return res.status(200).json({
      status: "Success",
      message: "Biodata updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

deleteBiodata = async (req, res) => {
  try {
    let { id } = req.params;

    let bio = await Biodata.findOne({
      where: { id },
    });

    if (!bio) {
      return res.status(404).json({
        status: "Error",
        message: "Biodata not found",
      });
    }

    let deleted = await bio.destroy();

    return res.status(200).json({
      status: "Success",
      message: "Biodata deleted successfully",
      data: bio,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  createBiodata,
  getAllBiodata,
  getBiodata,
  updateBiodata,
  deleteBiodata,
};
const Availability = require("../models/Availability");

const setAvailability = async (req, res) => {
  try {
    const { weeklySchedule } = req.body;
    const availability = await Availability.findOneAndUpdate(
      { provider: req.user._id },
      { weeklySchedule },
      { new: true, upsert: true, runValidators: true },
    );
    res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({
      provider: req.params.providerId,
    });
    if (!availability) {
      return res
        .status(404)
        .json({ message: "Availability not set for this provider" });
    }
    res.status(200).json(availability);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = { setAvailability, getAvailability };

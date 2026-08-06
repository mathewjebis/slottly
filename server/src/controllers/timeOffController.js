const TimeOff = require("../models/TimeOff");

const addTimeOff = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const timeOff = await TimeOff.create({
      provider: req.user._id,
      startDate,
      endDate,
      reason,
    });
    res.status(201).json(timeOff);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getMyTimeOff = async (req, res) => {
  try {
    const timeOffs = await TimeOff.find({ provider: req.user._id });
    res.status(200).json(timeOffs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const deleteTimeOff = async (req, res) => {
  try {
    const timeOff = await TimeOff.findById(req.params.id);
    if (!timeOff) {
      return res.status(404).json({ message: "Time off entry not found" });
    }
    if (timeOff.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this entry" });
    }
    await timeOff.deleteOne();
    res.status(200).json({ message: "Time off deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = { addTimeOff, getMyTimeOff, deleteTimeOff };

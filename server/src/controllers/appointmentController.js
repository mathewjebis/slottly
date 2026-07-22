const getAvailableSlots = require("../utils/slotGenerator");

const getSlots = async (req, res) => {
  try {
    const { providerId, serviceId, date } = req.query;
    const slots = await getAvailableSlots(providerId, serviceId, date);
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = getSlots;

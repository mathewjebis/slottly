const getAvailableSlots = require("../utils/slotGenerator");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

const getSlots = async (req, res) => {
  try {
    const { providerId, serviceId, date } = req.query;
    const slots = await getAvailableSlots(providerId, serviceId, date);
    res.status(200).json(slots);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { providerId, serviceId, date, startTime } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const availableSlots = await getAvailableSlots(providerId, serviceId, date);
    const slotStillAvailable = availableSlots.some(
      (slot) => slot.startTime === startTime,
    );
    if (!slotStillAvailable) {
      return res
        .status(400)
        .json({ message: "This slot is no longer available" });
    }

    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const minutesToTime = (mins) => {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };
    const endTime = minutesToTime(timeToMinutes(startTime) + service.duration);

    const appointment = await Appointment.create({
      customer: req.user._id,
      provider: providerId,
      service: serviceId,
      date,
      startTime,
      endTime,
      status: "pending",
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "provider"
        ? { provider: req.user._id }
        : { customer: req.user._id };

    const appointments = await Appointment.find(filter)
      .populate("service", "name duration price")
      .populate("customer", "name email")
      .populate("provider", "name email");

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isCustomer =
      appointment.customer.toString() === req.user._id.toString();
    const isProvider =
      appointment.provider.toString() === req.user._id.toString();
    if (!isCustomer && !isProvider) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res
        .status(400)
        .json({ message: `Cannot cancel a ${appointment.status} appointment` });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the provider can confirm appointments" });
    }
    if (appointment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending appointments can be confirmed" });
    }
    appointment.status = "confirmed";
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.provider.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the provider can complete appointments" });
    }
    if (appointment.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Only confirmed appointments can be completed" });
    }
    appointment.status = "completed";
    await appointment.save();
    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

module.exports = {
  getSlots,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
};

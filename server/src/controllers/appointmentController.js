const getAvailableSlots = require("../utils/slotGenerator");
const Service = require("../models/Service");
const Appointment = require("../models/Appointment");

const getSlots = async (req, res) => {
  try {
    const { providerId, serviceId, date } = req.query;
    const slots = await getAvailableSlots(providerId, serviceId, date);
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { providerId, serviceId, date, startTime } = req.body;
    const availableSlots = await getAvailableSlots(providerId, serviceId, date);
    const slotIsValid = availableSlots.some(
      (slot) => slot.startTime === startTime,
    );
    if (!slotIsValid) {
      return res.status(400).json({ message: "This slot is not available" });
    }
    const service = await Service.findById(serviceId);
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
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
        .json({ message: `Appointment is already ${appointment.status}` });
    }
    appointment.status = "cancelled";
    await appointment.save();
    res.status(200).json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getSlots, createAppointment, getMyAppointments,cancelAppointment };

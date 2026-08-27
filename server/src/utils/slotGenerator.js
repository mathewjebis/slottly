const Availability = require("../models/Availability");
const TimeOff = require("../models/TimeOff");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const { timeToMinutes, minutesToTime } = require("./timeHelpers");

const getAvailableSlots = async (providerId, serviceId, dateString) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  const date = new Date(dateString + "T00:00:00");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = dayNames[date.getDay()];

  const availability = await Availability.findOne({ provider: providerId });
  if (!availability) {
    return [];
  }

  const daySchedule = availability.weeklySchedule.find(
    (entry) => entry.day === dayOfWeek,
  );
  if (!daySchedule) {
    return [];
  }
  
  const timeOff = await TimeOff.findOne({
    provider: providerId,
    startDate: { $lte: date },
    endDate: { $gte: date },
  });
  if (timeOff) {
    return [];
  }

  const existingAppointments = await Appointment.find({
    provider: providerId,
    date: date,
    status: { $ne: "cancelled" },
  });

  const slots = [];
  const duration = service.duration;

  let currentTime = daySchedule.startTime;
  const endTime = daySchedule.endTime;

  while (timeToMinutes(currentTime) + duration <= timeToMinutes(endTime)) {
    const slotEnd = timeToMinutes(currentTime) + duration;

    const isBooked = existingAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return timeToMinutes(currentTime) < apptEnd && slotEnd > apptStart;
    });

    if (!isBooked) {
      slots.push({ startTime: currentTime, endTime: minutesToTime(slotEnd) });
    }

    currentTime = minutesToTime(slotEnd);
  }

  return slots;
};

module.exports = getAvailableSlots;

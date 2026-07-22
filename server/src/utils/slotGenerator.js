const Availability = require("../models/Availability");
const TimeOff = require("../models/TimeOff");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

const getAvailableSlots = async (providerId, serviceId, dateString) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  const date = new Date(dateString);
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

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const minutesToTime = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

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

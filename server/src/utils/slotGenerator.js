const Availability = require("../models/Availability");
const TimeOff = require("../models/TimeOff");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const { timeToMinutes, minutesToTime } = require("./timeHelpers");
const {
  getDayOfWeekUTC,
  getUTCDayRange,
} = require("./dateHelpers");

const getAvailableSlots = async (providerId, serviceId, dateString) => {
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    return [];
  }

  const cleanDateStr = String(dateString).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDateStr)) {
    return [];
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Prevent returning slots for past days
  if (cleanDateStr < todayStr) {
    return [];
  }

  const dayOfWeek = getDayOfWeekUTC(cleanDateStr);
  const { start: dayStart, end: dayEnd } = getUTCDayRange(cleanDateStr);

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
    startDate: { $lte: dayEnd },
    endDate: { $gte: dayStart },
  });
  if (timeOff) {
    return [];
  }

  const existingAppointments = await Appointment.find({
    provider: providerId,
    date: { $gte: dayStart, $lte: dayEnd },
    status: { $ne: "cancelled" },
  });

  const slots = [];
  const duration = service.duration;
  const startMins = timeToMinutes(daySchedule.startTime);
  const endMins = timeToMinutes(daySchedule.endTime);

  const isToday = cleanDateStr === todayStr;
  const currentMinsNow = now.getHours() * 60 + now.getMinutes();

  const step = duration >= 30 ? (duration % 30 === 0 ? 30 : 15) : 15;

  let currentMins = startMins;
  while (currentMins + duration <= endMins) {
    const slotEnd = currentMins + duration;

    // Skip past slots if target date is today
    if (isToday && currentMins <= currentMinsNow) {
      currentMins += step;
      continue;
    }

    const isBooked = existingAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return currentMins < apptEnd && slotEnd > apptStart;
    });

    if (!isBooked) {
      slots.push({
        startTime: minutesToTime(currentMins),
        endTime: minutesToTime(slotEnd),
      });
    }

    currentMins += step;
  }

  return slots;
};

module.exports = getAvailableSlots;

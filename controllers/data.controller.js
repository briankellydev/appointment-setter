const moment = require('moment');

const dataController = {};

dataController.generateUniqueId = () => {
    let id = '';
    for (let i = 0; i < 16; i++) {
        if (i === 4 || i === 8 || i === 12) {
            id = id.concat('-');
        }
        id = id.concat(Math.floor(Math.random() * 10));
    }
    return id;
};

dataController.sortBy = (key) => {
    return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

dataController.checkForAppointmentConflict = (userAppointments, newAppointment) => {
    // Check that the appointment doesn't conflict with an existing one
  const appointmentsOnThisDate = userAppointments.filter((appointment) => {
    return moment(appointment.start).toDate() === moment(newAppointment.start).toDate();
  });
  // Sort in order of time
  appointmentsOnThisDate.sort(this.sortBy(start));
  let conflictExists = false;
  appointmentsOnThisDate.forEach((appointment) => {
    // Conflicts if the time is the same
    if (moment(newAppointment.start).isSame(appointment.start)) {
      conflictExists = true;
    } else {
      // Find appointments where the time slots vaguely match up
      if (
        moment(newAppointment.start).isAfter(appointment.start) &&
        moment(appointment.start).isBefore(moment(newAppointment.end))
      ) {
        // Find out if the appointment start time is in the timeframe of an existing appt
        let endTime = moment(appointment.end);
        if (!moment(newAppointment.start).isAfter(endTime)) {
          conflictExists = true;
        }
      }
    }
  });
  return conflictExists;
}

module.exports = dataController;
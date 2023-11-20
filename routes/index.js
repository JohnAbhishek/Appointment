var express = require('express');
var router = express.Router();

var appointments=[
]
var count=1
router.get('/', function(req, res, next) {
 
  res.render('index', { appointments });
});
router.get('/add', function(req, res, next) {
 
  res.render('addappointment');
});

router.post('/add-appoint', function (req, res, next) {
  const newAppointment = {
    Appointmentcount: count,
    Time: req.body.starttime,
    EndTime: req.body.endtime
  };

  const appointmentDuration = new Date(`2000-01-01T${newAppointment.EndTime}`) - new Date(`2000-01-01T${newAppointment.Time}`);

  const isTimeConflict = appointments.some(appointment =>
    (newAppointment.Time >= appointment.Time && newAppointment.Time < appointment.EndTime) ||
    (newAppointment.EndTime > appointment.Time && newAppointment.EndTime <= appointment.EndTime) ||
    (newAppointment.Time <= appointment.Time && newAppointment.EndTime >= appointment.EndTime) ||
    (newAppointment.Time >= appointment.Time && newAppointment.EndTime <= appointment.EndTime)
  );

  if (isTimeConflict) {
    const existingTimes = appointments.map(appointment => ({
      start: new Date(`2000-01-01T${appointment.Time}`).getTime(),
      end: new Date(`2000-01-01T${appointment.EndTime}`).getTime()
    }));

    existingTimes.sort((a, b) => a.start - b.start);

    let recommendedStartTime = null;
    let recommendedEndTime = null;

    for (let i = 0; i < existingTimes.length - 1; i++) {
      const gapStartTime = existingTimes[i].end;
      const gapEndTime = existingTimes[i + 1].start;

      const gapDuration = gapEndTime - gapStartTime;

      
      if (gapDuration >= appointmentDuration) {
        recommendedStartTime = new Date(gapStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        recommendedEndTime = new Date(gapStartTime + appointmentDuration).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        break;
      }
    }
      res.render("selecttime", { recommendedStartTime, recommendedEndTime });
  } else {
    appointments.push(newAppointment);
    count++;
    res.redirect('/');
  }
});




router.get('/remove-appoint/:id', function (req, res, next) {
  const appointmentId = parseInt(req.params.id);
  console.log('Removing appointment with ID:', req.params.id);
  const indexToRemove = appointments.findIndex(appointment => appointment.Appointmentcount === appointmentId);
  console.log('Removing appointment with ID:', indexToRemove);
  if (indexToRemove !== -1) {
    appointments.splice(indexToRemove, 1);
    res.redirect('/');
  } else {
    res.status(404).send("Appointment not found");
  }
});


router.get('/edit/:id', function (req, res, next) {
  const appointmentId = parseInt(req.params.id);
  const appointmentToEdit = appointments.find(appointment => appointment.Appointmentcount === appointmentId);
    console.log(appointmentToEdit,"appointment");
  if (!appointmentToEdit) {
    res.status(404).send("Appointment not found");
  } else {
    res.render('editappointment',{ appointment: appointmentToEdit});
  }
});

router.post('/update-appoint/:id', function (req, res, next) {
  const appointmentId = parseInt(req.params.id);
  const appointmentToEdit = appointments.find(appointment => appointment.Appointmentcount === appointmentId);
  if (!appointmentToEdit) {
    res.status(404).send("Appointment not found");
  } else {
    appointmentToEdit.Time = req.body.time;
    appointmentToEdit.EndTime = req.body.endtime;
    res.redirect('/');
  }
});




module.exports = router;

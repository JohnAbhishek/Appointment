var express = require('express');
var router = express.Router();

var appointments=[
]
router.get('/', function(req, res, next) {
 
  res.render('index', { appointments });
});
router.get('/add', function(req, res, next) {
 
  res.render('addappointment');
});
router.post('/add-appoint', function (req, res, next) {
  const newAppointment = {
    Appointmentcount: req.body.title,
    Time: req.body.time,
  };
  const isTimeConflict = appointments.some(appointment => appointment.Time === newAppointment.Time);
  if(isTimeConflict){
    res.send("Already that time is allocated Select other")
  }else{
    appointments.push(newAppointment);
    res.redirect('/');
  }
  
});

router.get('/remove-appoint/:id', function (req, res, next) {
  const appointmentId = req.params.id;
  const indexToRemove = appointments.findIndex(appointment => appointment.Appointmentcount === appointmentId.toString());
  if (indexToRemove !== -1) {
    appointments.splice(indexToRemove, 1);
    res.redirect('/');
  } else {
    res.status(404).send("Appointment not found");
  }
});


router.get('/edit/:id', function (req, res, next) {
  const appointmentId = parseInt(req.params.id);
  const appointmentToEdit = appointments.find(appointment => appointment.Appointmentcount === appointmentId.toString());
    console.log(appointmentToEdit,"appointment");
  if (!appointmentToEdit) {
    res.status(404).send("Appointment not found");
  } else {
    res.render('editappointment',{ appointment: appointmentToEdit});
  }
});

router.post('/update-appoint/:id', function (req, res, next) {
  const appointmentId = parseInt(req.params.id);
  const appointmentToEdit = appointments.find(appointment => appointment.Appointmentcount === appointmentId.toString());

  if (!appointmentToEdit) {
    res.status(404).send("Appointment not found");
  } else {
    appointmentToEdit.Appointmentcount = req.body.title;
    appointmentToEdit.Time = req.body.time;
    
    res.redirect('/');
  }
});




module.exports = router;

const express = require('express');
const router = express.Router();

const VaccineController = require('../controllers/vaccine.controller');

router.post('/user/login', VaccineController.loginUser);
router.post('/user/register', VaccineController.registerUser);
router.post('/user/booking', VaccineController.bookingVaccine);

router.get('/provinces', VaccineController.getAllProvinces);
router.get('/province/:name', VaccineController.getProvince);

router.put('/city/:cityName/slot', VaccineController.updateSlot);

router.get('/admin/bookings', VaccineController.applicationStatsBooking);
router.get('/admin/users', VaccineController.applicationStatsUsers);

module.exports = router;

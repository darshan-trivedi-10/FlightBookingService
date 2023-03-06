const express = require('express');

const { BookingController } = require('../../controllers/index');

const bookingController = new BookingController();
const router = express.Router();

router.post('/bookings', bookingController.create);
router.get('/publish', bookingController.sendMessageToQueue)

module.exports = router;
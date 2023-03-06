const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes');

const bookingService = new BookingService();

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

class BookingController {

    async sendMessageToQueue(req, res) {
        try {
            const channel = await createChannel();
            const data = { message: 'Success' };
            await publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
            return res.status(200).json({
                message: 'Succesfully published the message'
            })
        } catch (error) {
            console.log(error);
            throw {error};
        }
    }

    async create(req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed a booking',
                success: true,
                err: {},
                date: response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explanation,
                data: {}
            })
        }
    }
}

module.exports = BookingController;


module.exports = BookingController;

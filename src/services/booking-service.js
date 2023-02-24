const axios = require('axios');

const { BookingRepository } = require('../repository/index')
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors/index');

/*
{
    "message": "Successfully completed a booking",
    "success": true,
    "err": {},
    "date": {
        "id": 1,
        "flightNumber": "10",
        "airplaneId": 3,
        "departureAirportId": 2,
        "arrivalAirportId": 1,
        "arrivalTime": "2023-02-12T08:04:00.000Z",
        "departureTime": "2023-02-12T08:03:00.000Z",
        "price": 5100,
        "boardingGate": null,
        "totalSeats": 400,
        "createdAt": "2023-02-11T16:56:43.000Z",
        "updatedAt": "2023-02-11T16:56:43.000Z"
    }
}
*/

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            // Get The Flight Details using Flight Id 
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;

            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Something went wrong in the booking process', 'Insufficient seats in the Flights');
            }
            // Calculating Cost and booking the ticket and Update seats in the Flights
            let totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.bookingRepository.create(bookingPayload);

            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {
                totalSeats: flightData.totalSeats - booking.noOfSeats
            });

            const finalBooking = await this.bookingRepository.update(booking.id, { status: "Booked" });
            return finalBooking;
        } catch (error) {
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }

    }



}

module.exports = BookingService;
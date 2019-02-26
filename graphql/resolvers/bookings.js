const Event = require('./../../model/event');
const Booking = require('./../../model/booking');

const { transformBooking, transformEvent } = require('./helpers');


module.exports = {
    /**
     * Bookings
     */
    async bookings(data, request) {
        if (!request.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const docs = await Booking.find();

            const bookings = docs.map(doc => {
                const { _doc: booking } = doc;
                
                return transformBooking(booking);
            });
            
            return bookings;
        } catch (error) {
            throw error
        }
    },
    async bookEvent(data, request) {
        if (!request.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const event = await Event.findById(data.eventId);

            if (!event) {
                throw new Error(`Can't find event[${data.eventId}]`);
            }

            const { _doc: booking } = await Booking.create({
                event: data.eventId,
                user: request.userId,
            });
            
            return transformBooking(booking);
        } catch (error) {
            throw error;
        }
    },
    async cancelBooking(data, request) {
        if (!request.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const { _doc: booking } = await Booking.findById(data.bookingId).populate('event');
            const event = booking.event._doc;

            await Booking.findByIdAndDelete(data.bookingId);

            return transformEvent(event);
        } catch (error) {
            throw error;
        }
    }
};

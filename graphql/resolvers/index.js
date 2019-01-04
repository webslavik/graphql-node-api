const bcrypt = require('bcryptjs');

const Event = require('./../../model/event')
const User = require('./../../model/user');
const Booking = require('./../../model/booking');
const { dateToString } = require('./../../helpers');

const defaultUser = '5c27a1aa03ffb50a5726941e';


const transformEvent = event => {
    return {
        ...event,
        _id: event._id.toString(),
        date: dateToString(event.date),
        creator: findEventCreator.bind(this, event.creator),
    };
}

const transformBooking = booking => {
    return {
        ...booking,
        _id: booking._id.toString(),
        event: singleEvent(booking.event),
        user: findEventCreator(booking.user),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
    }
}

const findEventCreator = async (userId) => {
    try {
        const { _doc: user } = await User.findById(userId); 

        return {
            ...user,
            _id: user._id.toString(),
            events: multipleEvents.bind(this, user.events),
        }
    } catch (error) {
        throw error;
    }
}

const multipleEvents = async (eventsIdArray) => {
    try {
        const docs = await Event.find({ 
            _id: {
                $in: eventsIdArray,
            } 
        });

        const events = docs.map(doc => {
            const { _doc: event } = doc;

            return transformEvent(event);
        });

        return events;
    } catch (error) {
        throw error;
    }
}

const singleEvent = async (eventId) => {
    try {
        const { _doc: event } = await Event.findById(eventId);
        
        return transformEvent(event);
    } catch (error) {
        throw error
    }
}

module.exports = {
    /**
     * Events
     */
    async events() {
        try {
            const docs = await Event.find();

            const events = docs.map(doc => {
                const { _doc: event } = doc;

                return transformEvent(event);
            });

            return events;
        } catch (error) {
            throw error;
        }
    },
    async createEvent(data) {
        try {
            const { _doc: event } = await Event.create({
                title: data.eventInput.title,
                description: data.eventInput.description,
                price: +data.eventInput.price,
                date: data.eventInput.date,
                creator: defaultUser,
            });

            await User.findByIdAndUpdate(defaultUser, {
                $push: {
                    events: event,
                }
            });

            return transformEvent(event);
        } catch (error) {
            throw error;
        }
    },


    /**
     * User
     */
    async createUser(data) {
        try {
            const email = data.userInput.email;
            const password = data.userInput.password;

            const foundUser = await User.findOne({ email });

            if (foundUser) {
                throw new Error('Invalid credentials');
            }

            const hashPassword = bcrypt.hashSync(password);

            const user = await User.create({
                email,
                password: hashPassword,
            });
            
            return {
                ...user._doc,
                password: null,
            }
        } catch (err) {
            throw error;
        }
    },


    /**
     * Bookings
     */
    async bookings() {
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
    async bookEvent(data) {
        try {
            const event = await Event.findById(data.eventId);

            if (!event) {
                throw new Error(`Can't find event[${data.eventId}]`);
            }

            const { _doc: booking } = await Booking.create({
                event: data.eventId,
                user: defaultUser,
            });
            
            return transformBooking(booking);
        } catch (error) {
            throw error;
        }
    },
    async cancelBooking(data) {
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

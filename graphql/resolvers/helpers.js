const Event = require('./../../model/event');
const User = require('./../../model/user');

const { dateToString } = require('./../../helpers');


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

module.exports = {
    transformEvent,
    transformBooking,

    // for test
    defaultUser,
};

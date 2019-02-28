const DataLoader = require('dataloader')

const Event = require('./../../model/event');
const User = require('./../../model/user');

const { dateToString } = require('./../../helpers');


const eventLoader = new DataLoader((eventIds) => {
    return multipleEvents(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: { $in: userIds }});
})

const findEventCreator = async (userId) => {
    try {
        const { _doc: user } = await userLoader.load(userId.toString());

        const transformEvents = user.events.map(event => {
            return event.toString();
        });

        return {
            ...user,
            _id: user._id.toString(),
            events: () => eventLoader.loadMany(transformEvents),
        }
    } catch (error) {
        throw error;
    }
}

const multipleEvents = async (eventsIdArray) => {
    try {
        const events = await Event.find({ 
            _id: {
                $in: eventsIdArray,
            } 
        });

        return events.map(doc => {
            const { _doc: event } = doc;
            return transformEvent(event);
        });
    } catch (error) {
        throw error;
    }
}

const singleEvent = async (eventId) => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (error) {
        throw error
    }
}


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
        event: singleEvent.bind(this, booking.event._id),
        user: findEventCreator(booking.user),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
    }
}

module.exports = {
    transformEvent,
    transformBooking,
};

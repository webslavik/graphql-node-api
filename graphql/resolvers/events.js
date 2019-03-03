const Events = require('./../../model/event');
const User = require('./../../model/user');

const { transformEvent } = require('./helpers');


module.exports = {
    async events() {
        try {
            const docs = await Events.find();

            const events = docs.map(doc => {
                const { _doc: event } = doc;

                return transformEvent(event);
            });

            return events;
        } catch (error) {
            throw error;
        }
    },
    async createEvent(data, request) {
        if (!request.isAuth) {
            throw new Error('Unauthenticated');
        }

        const userId = request.userId;

        try {
            const { _doc: event } = await Events.create({
                title: data.eventInput.title,
                description: data.eventInput.description,
                price: +data.eventInput.price,
                date: data.eventInput.date,
                creator: userId,
            });

            await User.findByIdAndUpdate(userId, {
                $push: {
                    events: event._id,
                }
            });

            return transformEvent(event);
        } catch (error) {
            throw error;
        }
    },
};

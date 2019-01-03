const bcrypt = require('bcryptjs');

const Event = require('./../../model/event')
const User = require('./../../model/user');


const findEventCreator = async (userId) => {
    try {
        const { _doc: user } = await User.findById(userId); 

        return {
            ...user,
            _id: user._id.toString(),
            events: findEvents.bind(this, user.events),
        }
    } catch (error) {
        throw error;
    }
}

const findEvents = async (eventsIdArray) => {
    try {
        const docs = await Event.find({ 
            _id: {
                $in: eventsIdArray,
            } 
        });

        const events = docs.map(doc => {
            const { _doc: event } = doc;

            return {
                ...event,
                _id: event._id.toString(),
                creator: findEventCreator.bind(this, event.creator),
            }
        });

        return events;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    async events() {
        try {
            const docs = await Event.find();

            const events = docs.map(event => {
                const { date, _doc: user } = event;

                return {
                    ...user,
                    _id: user._id.toString(),
                    creator: findEventCreator.bind(this, user.creator),
                    date: new Date(date).toISOString(),
                }
            })

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
                creator: '5c27a1aa03ffb50a5726941e',
            });

            await User.findByIdAndUpdate('5c27a1aa03ffb50a5726941e', {
                $push: {
                    events: event,
                }
            });

            return {
                ...event,
                _id: event._id.toString(),
                date: new Date(event.date).toISOString(),
                creator: findEventCreator.bind(this, event.creator),
            }
        } catch (error) {
            throw error;
        }
    },
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
    }
};

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');

const app = express();

const Event = require('./model/event')
const User = require('./model/user');


app.use(bodyParser.json());

app.use('/api', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }


        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        async events() {
            try {
                const docs = await Event.find();

                const events = docs.map(event => {
                    return {
                        _id: event._id.toString(),
                        title: event.title,
                        description: event.description,
                        price: event.price,
                        date: event.date,
                    }
                })

                return events;
            } catch (error) {
                throw error;
            }
        },
        async createEvent(data) {
            try {
                const event = await Event.create({
                    title: data.eventInput.title,
                    description: data.eventInput.description,
                    price: +data.eventInput.price,
                    date: data.eventInput.date,
                    creator: '5c27a1aa03ffb50a5726941e',
                });

                await User.findByIdAndUpdate('5c27a1aa03ffb50a5726941e', {
                    $push: {
                        events: event
                    }
                })

                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
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
    },
    graphiql: true
}))

mongoose
    .connect('mongodb://localhost:27017/graphqlAPI', { useNewUrlParser: true })
    .then(() => {
        console.log('Connection to DB is successful.')
        app.listen(3000);
    })
    .catch((error) => {
        console.log(`Can't connect to DB: ${error}`)
    })

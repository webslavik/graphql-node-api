const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const Event = require('./model/event')

const events = []

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

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
        async createEvent(args) {
            try {
                const event = await Event.create({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: args.eventInput.date
                });

                return {
                    ...event._doc,
                    _id: event._doc._id.toString(),
                }
            } catch (error) {
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

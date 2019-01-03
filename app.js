const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');

const app = express();

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');


app.use(bodyParser.json());



app.use('/api', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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

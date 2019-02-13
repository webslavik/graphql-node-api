const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');

const app = express();

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const { isAuth } = require('./middleware');


app.use(bodyParser.json());
app.use(isAuth);

// CORS
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return  response.status(200).json({});
    }

    next();
});


app.use('/api', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
}));

mongoose
    .connect('mongodb://localhost:27017/graphqlAPI', { useNewUrlParser: true })
    .then(() => {
        console.log('Connection to DB is successful.')
        app.listen(3001);
    })
    .catch((error) => {
        console.log(`Can't connect to DB: ${error}`)
    });

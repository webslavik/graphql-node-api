const jwt = require('jsonwebtoken');


const isAuth = (request, response, next) => {
    const authHeader = request.get('Authorization');

    if (!authHeader) {
        request.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === '') {
        request.isAuth = false;
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, 'secret');

        if (!decodedToken) {
            request.isAuth = false;
            return next();
        }

        request.isAuth = true;
        request.userId = decodedToken.userId;
        next();
    } catch (error) {
        request.isAuth = false;
        return next();
    }
}

module.exports = isAuth;

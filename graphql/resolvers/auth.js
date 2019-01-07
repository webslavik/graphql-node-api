const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../../model/user');


module.exports = {
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

    async login({ email, password }) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new Error('You have entered an invalid username or password');
            }

            const isEqual = await bcrypt.compare(password, user.password);            

            if (!isEqual) {
                throw new Error('You have entered an invalid username or password');
            }

            const token = await jwt.sign(
                { userId: user.id, email: user.email},
                'secret',
                { expiresIn: '1h' });

            return {
                userId: user.id,
                token,
                tokenExpiration: 1
            };
        } catch (error) {
            throw error;
        }
    }
};

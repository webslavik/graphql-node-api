const bcrypt = require('bcryptjs');

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
};

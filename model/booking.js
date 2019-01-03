const { Schema, model } = require('mongoose');


const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Events',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
}, { timestamps: true });

module.exports = model('Bookings', bookingSchema);

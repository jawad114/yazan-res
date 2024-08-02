require('dotenv').config();
const mongoose = require('mongoose');

var url = process.env.DB_CONECTION_STR;

mongoose.connect(url, {})
    .then(() => console.log('Connected successfully to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));




const ResturantSchema = new mongoose.Schema({
    RestName: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        required: true,
    },
    OpenH: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    CloseH: {
        type: String,
        required: true,
    },
    PictureUrl: {
        type: String,
        required: true,
    },

    Approved: {
        type: String,
    },
    NotApproved: {
        type: String,
    }
});




// const ContactSchema = new mongoose.Schema({
//     PictureUrl: { type: String, required: true },
//     FirstName: { type: String, required: true },
//     LastName: { type: String, required: true },
//     Course: {
//         type: String,
//         enum: ["Computer Science", "Programming", "Cybersecurity"],
//         required: true
//     },
//     PhoneNumber: { type: String, required: true },
//     Message: { type: String, required: true },
//     Email: { type: String, required: true },
//     CallingStatus: { type: String, required: true }
// });


// create Model from the schema we created above
module.exports.Resturant = mongoose.model('Resturant', ResturantSchema);
// module.exports.Contact = mongoose.model('Contact', ContactSchema);

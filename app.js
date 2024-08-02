const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use cors middleware with specified options correctly
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Import and use student API routes
const ResturantRoutes = require('../Routes/studentApiRoutes');
app.use('/api/Resturant', ResturantRoutes);


app.use(express.static('public'));
//=========================
const port = process.env.PORT || 3003;

app.listen(port, function () {
    console.log(`My app is listening on port ${port}!`);
});

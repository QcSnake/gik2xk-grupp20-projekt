var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { extractUser } = require('./middleware/authMiddleware');

var app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add user extraction middleware
app.use(extractUser);

// Routes
app.use("/users", require("./routes/usersRoute"));
app.use('/products', require('./routes/productsRoute'));
app.use("/carts", require("./routes/cartsRoute"));
app.use("/auth", require("./routes/authRoute"));

module.exports = app;

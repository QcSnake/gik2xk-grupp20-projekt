var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { extractUser } = require('./middleware/authMiddleware');

var app = express();

//  för frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-User-Info']
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware för användarinfo
app.use(extractUser);

// Rutter
app.use("/users", require("./routes/usersRoute"));
app.use('/products', require('./routes/productsRoute'));
app.use("/carts", require("./routes/cartsRoute"));
app.use("/auth", require("./routes/authRoute"));

module.exports = app;

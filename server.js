require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const itemRoutes = require('./src/routes/itemRoutes');
const auctionRoutes = require('./src/routes/auctionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/items', itemRoutes);
app.use('/auctions', auctionRoutes);
app.use('/users', userRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const itemRoutes = require('./src/routes/itemRoutes');
const auctionRoutes = require('./src/routes/auctionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const bidRoutes = require('./src/routes/bidRoutes');
const complaintRoutes = require('./src/routes/complaintRoute');
const verificationRoute = require('./src/routes/verificationRoutes');
const fileUpload = require('express-fileupload');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51QQR6DFw48wdxghHTI1X7vo1RhF59wRTM2d0IVWCx8q4qjNXk4LXsCMNsRLhMo02VZHYZBeJPIb1qqFCIuSWEaUt00HUAvEFJK'); 
const cron = require('node-cron');
const pool = require('./config/database'); // Your database pool
const auctionModel = require('./src/models/auctionModel');  // Your auction model
const uploadRouter = require('./src/middleware/upload');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const port = 3000;

// Cron job to run every minute (you can adjust the interval as needed)
cron.schedule('* * * * *', async () => {
  console.log('Checking for auctions to close...');
  
  try {
    // Fetch all auctions that are open and have passed their end_time
    const query = `
      SELECT auction_id FROM auctions
      WHERE status = 'open' AND end_time < current_timestamp
    `;
    const res = await pool.query(query);

    // Loop through the result set and close each auction
    for (const auction of res.rows) {
      console.log(`Closing auction ${auction.auction_id}`);
      await auctionModel.setInActive(auction.auction_id); // Pass auction_id to setInActive method
    }
  } catch (error) {
    console.error('Error during auction close check:', error);
  }
});


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/items', itemRoutes);
app.use('/auctions', auctionRoutes);
app.use('/users', userRoutes);
app.use('/bids', bidRoutes);
app.use('/complaints', complaintRoutes);
app.use('/verification', verificationRoute);
app.use('/upload', uploadRouter);
app.use('/admin', adminRoutes);


app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body; // Amount in smallest currency unit (e.g., cents for USD)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
const express = require('express');
const ComplaintController = require('../controllers/complaintController');
const router = express.Router();
const auth = require('../middleware/auth');
const verification = require('../middleware/verification');

// Create a new complaint
router.post('/',  ComplaintController.createComplaint);

// Get all complaints
router.get('/getAll', auth,  ComplaintController.getAllComplaints);

// Get a specific complaint by ID
router.get('/getComplaint/:id', auth, ComplaintController.getComplaintById);

// Delete a complaint by ID
router.get('/delete/:id', auth, ComplaintController.deleteComplaint);

module.exports = router;

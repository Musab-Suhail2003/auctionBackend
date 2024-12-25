const express = require('express');
const router = express.Router();
const  UserController  = require('../controllers/userController.js');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin.js');
const ComplaintController = require('../controllers/complaintController.js');
const escrowModel = require('../models/escrowModel');


router.post('/verify', auth, admin, UserController.verify);
router.get('/complaints', auth, admin, ComplaintController.getAllComplaints);
router.get('/complaints/:complaint_id', auth, admin, ComplaintController.getComplaintById);
router.get('/complaints/resolve/:complaint_id', auth, admin, ComplaintController.resolveComplaint);
router.post('/escrow/reverse', auth, admin, async (req, res) => {
    try {
        const {auction_id} = req.body;
        const result = await escrowModel.reverseEscrowTransfer(auction_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
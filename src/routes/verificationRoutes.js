const express = require("express");
const { createVerification, getVerificationReq } = require("../controllers/verificationController");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const auth = require('../middleware/auth.js');

router.post("/", auth, createVerification);
router.get("/get", getVerificationReq);
router.get('/verify/:user_id', verify);

module.exports = router;

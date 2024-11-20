const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('user_name').trim().isLength({ min: 2 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateUser;
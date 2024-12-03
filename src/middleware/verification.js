const UserModel = require('../models/userModel.js');

module.exports = async function(req, res, next){
    const result = await UserModel.findById(req.body.user_id);
    const verfied = result['verification'] == 'verified';
   
    if (!verfied) {
      return res.status(400).json({ message: 'unverified' });
    }
    next();

};
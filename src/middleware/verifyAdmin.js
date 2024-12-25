const UserModel = require('../models/userModel.js');

module.exports = async function(req, res, next){
    const result = await UserModel.findById(req.body.user_id);
    const admin = result['admin'];
   
    if (!admin) {
      return res.status(400).json({ message: 'not an admin' });
    }
    next();

};
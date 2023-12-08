const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  email: { type: String, required: false },
  isActive: { type: Boolean, required: true, default: true }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// // Update email, isActive field for users where it doesn't exist
// User.updateMany({
//   email: { $exists: false },
//   isActive: { $exists: false }
// }, {
//   $set: {
//     email: null,
//     isActive: false
//   }
// })
//   .then(result => {
//     console.log('Users updated successfully:', result);
//   })
//   .catch(err => {
//     console.error('Error updating users:', err);
//   });

module.exports = User;

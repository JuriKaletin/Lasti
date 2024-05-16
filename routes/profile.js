var express = require('express');
var router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const UserClient = require('../models/UserClient');

router.get('/', requireLogin, async function(req, res, next) {
  const authorizedUser = req.session.user;

  const user = await UserClient.findOne({email: authorizedUser.email})

  res.render('profile', { user: user });
});

router.get('/logout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
});

router.post('/delete-user', function(req, res, next) {
  const user = req.session.user;
  UserClient.findOneAndDelete({ email: user.email })
    .then(result => {
      if (result) {
        console.log('User deleted:', result);
        delete req.session.user;
        res.status(200).json({ message: 'Deleting successful', redirectUrl: '/companies' });
      } else {
        console.log('User not found');
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/update-user', function(req, res, next) {
  const user = req.session.user;
  const { username, phone } = req.body;

  UserClient.findOneAndUpdate(
    { email: user.email },
    { $set: { username: username, phone: phone } },
    { new: true }
  )
    .then(updatedUser => {
      if (updatedUser) {
        console.log('User updated');
        res.status(200).json({ message: 'User updated successfully' });
      } else {
        console.log('User not found');
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
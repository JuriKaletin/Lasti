var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');
const requireLogin = require('../middleware/requireLogin');
const UserPartner = require('../models/UserPartner');


router.get('/', requireLogin, async function(req, res, next) {
  const authorizedUser = req.session.user;

  const user = await UserPartner.findOne({email: authorizedUser.email})
  
  res.render('profile', { user: user });
});

router.get('/logout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
});

router.post('/delete-user', function(req, res, next) {
  const user = req.session.user;
  UserPartner.findOneAndDelete({ email: user.email })
  .then(result => {
      if (result) {
        console.log('User deleted:', result);
        delete req.session.user;
        res.status(200).json({ message: 'Deleting successful', redirectUrl: '/' });
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
    const { companyName, phone, city, equipment, description } = req.body;

  UserPartner.findOneAndUpdate(
    { email: user.email },
    { $set: { companyName: companyName, phone: phone, city: city, description: description, equipment: equipment } },
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

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'clientUploads/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ 
    storage: storage,
  });
  
  router.post('/upload', upload.single('photo'), async (req, res) => {
    try {
      const filePath = req.file.path;
      
      const user = await UserPartner.findOneAndUpdate(
        { email: req.session.user.email },
        { $set: { photo: filePath } },
        { new: true }
      );
      
      res.status(200).send('File uploaded successfully');
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Server error');
    }
  });

  module.exports = router;
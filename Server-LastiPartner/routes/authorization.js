var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const UserPartner = require('../models/UserPartner');
const  { sendEmail } = require('../middleware/mailer');

router.get('/', function(req, res, next) {
  res.render('authorization');
});

router.post('/registration', async function(req, res, next) {
  const { email, phone, password, companyName, city } = req.body;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.error('Error generating salt:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      const newUser = new UserPartner({
        email: email,
        password: hash,
        companyName: companyName,
        city: city,
        phone: phone
      });

      newUser.save()
        .then(savedUser => {
          console.log('User registered');
          req.session.user = { email: email, phone: phone, companyName: companyName, city: city };
          res.status(200).json({ message: 'User registered', redirectUrl: '/advertisment' });
        })
        .catch(error => {
          console.error("User registration error:", error);
          res.status(500).json({ message: "User registration error" });
        });
    });
  });

});

router.post('/check-email', async function(req, res, next) {
  const { email, code } = req.body;

  const user = await UserPartner.findOne({ email }).exec();

  if (user) {
    console.log('User already registered');
    res.status(200).json({ message: 'User already registered' });
  } else {
    try {
      await sendEmail(email, code);
      res.status(200).json({ message: 'Email checking...' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  }
});

router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  try {
      const user = await UserPartner.findOne({ email }).exec();

      if (user) {
          bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
              console.error('Error comparing passwords:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            if (result) {
              req.session.user = { email: email, companyName: user.companyName, phone: user.phone, city: user.city };
              res.status(200).json({ message: 'Login successful', redirectUrl: '/advertisment' });
            } else {
              res.status(401).json({ message: 'Invalid email or password' });
            }
          });
      } else {
          res.status(401).json({ message: 'Invalid email or password' });
      }
  } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

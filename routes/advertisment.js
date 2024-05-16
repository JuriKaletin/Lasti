var express = require('express');
var router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const Advertisement = require('../models/Advertisment');
const UserPartner = require('../models/UserPartner');

router.get('/', requireLogin, async function(req, res, next) {
  try {
    const authorizedUserEmail = req.session.user.email;

    const advertisements = await Advertisement.find({ author: authorizedUserEmail })

    res.render('advertisment', { advertisements: advertisements });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-advertisment', function(req, res, next) {
  const { city, address, description } = req.body;
  const { email } = req.session.user;

    const newAdversitment = new Advertisement({
        city: city,
        address: address,
        author: email,
        description: description
    });

    newAdversitment.save()
        .then(savedAdversitment => {
            console.log('Advertisement created');
            res.status(201).json({ message: 'Advertisement created' });
        })
        .catch(error => {
            console.error('Error creating advertisement:', error);
            res.status(500).json({ message: 'Server error' });
        });
});

router.post('/delete-advertisment', async function(req, res, next) {
  const id = req.body.id;

  try {
    const advertisement = await Advertisement.findByIdAndDelete(id);
    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    res.status(200).json({ message: "Advertisement deleted" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/likes-advertisment/:id', async function(req, res, next) {
  const id = req.params.id; 

  try {
    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    
    const likedEmails = advertisement.likes;

    const users = await UserPartner.find({ email: { $in: likedEmails } });

    res.render('companies', { companies: users, text: 'Ettevõtted, kellele meeldis:' });

  } catch (error) {
    console.error("Error fetching liked users:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;

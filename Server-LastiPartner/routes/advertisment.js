var express = require('express');
var router = express.Router();
const moment = require('moment');
const requireLogin = require('../middleware/requireLogin');
const Advertisement = require('../models/Advertisment');
const UserClient = require('../models/UserClient');

router.get('/', requireLogin, async function(req, res, next) {
  try {
    const advertisements = await Advertisement.find().sort({ date: -1 });

    const advertisementsWithData = [];

    for (const advertisement of advertisements) {
      const user = await UserClient.findOne({ email: advertisement.author });

      if (user) {
        const formattedDate = moment(advertisement.date).format('DD.MM.YYYY HH:mm');

        const isLikedByUser = advertisement.likes.includes(req.session.user.email);

        advertisementsWithData.push({
          id: advertisement._id,
          city: advertisement.city,
          address: advertisement.address,
          username: user.username,
          phone: user.phone,
          description: advertisement.description,
          date: formattedDate,
          isLikedByUser: isLikedByUser 
        });
      }
    }

    res.render('advertisment', { advertisements: advertisementsWithData });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/like', requireLogin, async function(req, res, next) {
  const { id } = req.body;
  const authorizedUser = req.session.user;

  try {
    const updatedAdvertisement = await Advertisement.findOneAndUpdate(
      { _id: id },
      { $addToSet: { likes: authorizedUser.email } },
      { new: true }
    );

    return res.status(200).json({ message: 'Advertisement liked successfully' });
  } catch (error) {
    console.error('Error liking advertisement:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/unlike', requireLogin, async function(req, res, next) {
  const { id } = req.body;
  const authorizedUser = req.session.user;

  try {
    const updatedAdvertisement = await Advertisement.findOneAndUpdate(
      { _id: id },
      { $pull: { likes: authorizedUser.email } }, // Удалить адрес электронной почты из поля "likes"
      { new: true }
    );

    return res.status(200).json({ message: 'Advertisement unliked successfully' });
  } catch (error) {
    console.error('Error unliking advertisement:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const UserPartner = require('../models/UserPartner');

router.get('/', requireLogin, async function(req, res, next) {

  const companies = await UserPartner.find()

  res.render('companies', {companies: companies, text: 'Saadaolevad ettevõtted'});
});

module.exports = router;
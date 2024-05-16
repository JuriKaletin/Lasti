const nodemailer = require('nodemailer');

function sendEmail(email, code) {
  return new Promise((resolve, reject) => {
    const orderInfo = `
Hi!

Account activation code: ${code}
    `;

    const mailOptions = {
      from: 'lasti.check@gmail.com',
      to: email,
      subject: `Email Activation`,
      text: orderInfo
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: 'lasti.check@gmail.com',
        pass: 'osvcutrcafmxfoka'
      }
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Mail error:', error.message);
        reject(error);
      } else {
        console.log('Mail success:', info.response);
        resolve(info);
      }
    });
  });
}

module.exports = { sendEmail };

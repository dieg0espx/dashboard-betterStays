const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const bodyParser = require('body-parser');

// Parse JSON request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route
app.post('/api/newInvoice', async (req, res) => {
  let { title, description, amount, invoiceID, email } = req.body;


  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'betterstaynow@gmail.com',
        pass: 'ypegluemtoyjmsfv'
      }
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve('./views'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views'),
      extName: ".handlebars",
    };
    transporter.use('compile', hbs(handlebarOptions));

    const customerMailOptions = {
      from: 'Better Stays',
      to: email,
      subject: 'New Invoice',
      template: 'invoice',
      context: {
        title, description, amount, invoiceID
      }
    };

    const customerEmail = await transporter.sendMail(customerMailOptions);
    console.log('Email sent: ' + customerEmail.response);
    res.send(req.body);


  } catch (error) {
    console.log(error);
    res.status(500).send('Error sending email');
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

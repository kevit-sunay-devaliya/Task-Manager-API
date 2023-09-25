// const sgMail = require("@sendgrid/mail");
// const sendgridAPIKey = "";

// sgMail.setApiKey(sendgridAPIKey);

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 587,

  auth: {
    user: "kevit.sunay.devaliya@gmail.com",

    pass: "qdmn lqvj sint nnkq",
  },
});

const sendWelcomeMails = (email, name) => {
  transporter.sendMail({
    to: email,
    from: "kevit.sunay.devaliya2456@gmail.com",
    subject: "Welcome Message",
    text: `Hello ${name} , Welcome to the App`,
  });
};

const sendCancelationMails = (email, name) => {
  transporter.sendMail({
    to: email,
    from: "kevit.sunay.devaliya2456@gmail.com",
    subject: "Welcome Message",
    text: `Good Bye Mr. ${name}`,
  });
};

module.exports = {
  sendWelcomeMails,
  sendCancelationMails,
};

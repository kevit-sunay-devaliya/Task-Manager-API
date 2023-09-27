// const sgMail = require("@sendgrid/mail");
// const sendgridAPIKey = "";

// sgMail.setApiKey(sendgridAPIKey);

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 587,

  auth: {
    user: process.env.USER,

    pass: process.env.PASSWORD,
  },
});

async function sendWelcomeMails(email, name) {
  try {
    const info = await transporter.sendMail({
      to: email,
      from: "kevit.sunay.devaliya2456@gmail.com",
      subject: "Welcome Message",
      text: `Hello ${name} , Welcome to the App`,
    });
    // console.log("Message Sent.. :  %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}
async function sendCancelationMails(email, name) {
  try {
    const info = await transporter.sendMail({
      to: email,
      from: "kevit.sunay.devaliya2456@gmail.com",
      subject: "Welcome Message",
      text: `Good Bye Mr. ${name}`,
    });
    // console.log("Message Sent.. :  %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendWelcomeMails,
  sendCancelationMails,
};

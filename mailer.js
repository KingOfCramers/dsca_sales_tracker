const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const config = require("./config");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    type: "OAuth2",
    user: config.auth.user,
    clientId: config.auth.clientId,
    clientSecret: config.auth.clientSecret,
    refreshToken: config.auth.refreshToken
  }
});

module.exports = {
  transporter
}
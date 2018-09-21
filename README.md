# dsca_sales_tracker

Requires config.js file like this: 

const auth = {
    type: "OAuth2",
    user: "USER_EMAIL_ACCOUNT",
    clientId: "CLIENT_ID_FROM_GOOGLE",
    clientSecret: "CLIENT_SECRET_FROM_GOOGLE",
    refreshToken: "REFRESH_TOKEN_FROM_GOOGLE"
}

const recipient = "RECIPIENT_EMAIL_ACCOUNT";

module.exports = {
  auth,
  recipient
}

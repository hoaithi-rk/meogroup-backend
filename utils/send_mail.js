require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
// const { OAuth2Client }  = require('google-auth-library')
const ejs = require('ejs')

const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const sendEmail = async infoEmail => {
    const accessTokenObject = await oAuth2Client.getAccessToken()
    const accessToken = accessTokenObject?.token
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_ADDRESS,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const letter = await ejs.renderFile('./views/email_template.ejs', {
        username: infoEmail.username,
        message: infoEmail.message,
        messageAction: infoEmail.messageAction,
        action: infoEmail.action,
        url: infoEmail.url
    })
    
    const email = {
        from: process.env.GMAIL_ADDRESS,
        to: infoEmail.destination,
        subject: infoEmail.subject,
        html: letter,
    }

    await transporter.sendMail(email);
}

module.exports = {
    sendEmail
};

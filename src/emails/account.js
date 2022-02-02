const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//asyncronous fn (can use async, await if u want)
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'magdelinenxl@gmail.com',
        subject: 'Welcome to the app!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendGoodbyeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'magdelinenxl@gmail.com',
        subject: 'Sorry to see you leave!',
        text: `Goodbye ${name}! Is there anything we could have done to kept you on board?`
    })
}

module.exports = {
    sendWelcomeEmail,  //shorthand syntax for sendWelcomeEmail : sendWelcomeEmail
    sendGoodbyeEmail
}
const sendmail = require('sendmail')({ silent: false });

module.exports.sendRegistrationEmail = function (emailAddress, verificationCode) {
    sendmail({
        from: 'bubach@luxoft.com',
        to: emailAddress,
        subject: 'Please validate your email address',
        html: `
    <body>
        <h1>Hi ${emailAddress}!</h1>
        <p>We're glad that you've decided to try the Luxoft Parking App!</p>
        <p>Just click <a href="http://localhost:3000/v1/user/validate/${verificationCode}">here</a> to validate your email and start using the application on your phone :)</p>
        <p>We hope you enjoy the application!</p>
    </body>
`,
    }, function (err, reply) {
        console.log(err && err.stack);
        console.log(reply);
    });
};


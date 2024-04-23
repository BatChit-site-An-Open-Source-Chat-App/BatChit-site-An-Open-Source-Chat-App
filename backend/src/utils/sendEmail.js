import nodemailer from "nodemailer";

const EMAIL_TYPES = {
   ACCOUNT_ACTIVATION: "ACCOUNT_ACTIVATION",
   FORGOT_PASSWORD: "FORGOT_PASSWORD",
   TWEET_SHARED: "TWEET_SHARED",
   ACCOUNT_OPENED: "ACCOUNT_OPENED",

   SEND_OTP: "send_otp",
};

var transporter = nodemailer.createTransport({
   host: process.env.HOST,
   port: 465,
   auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
   },
});

function sendEmail(emailType, toEmail, params) {
   let subject, htmlContent;

   switch (emailType) {
      case EMAIL_TYPES.ACCOUNT_ACTIVATION:
         subject = "Account Activation";
         htmlContent = `
        <html>
          <head></head>
          <body>
            <h1>Account Activation</h1>
            <p>Click the link below to activate your account:</p>
            <a href="${process.env.BACKEND_WEBSITE}/api/v1/users/activation-account/${toEmail}/${params}">Activate Account</a>
          </body>
        </html>
      `;
         console.log(`sent!`);
         break;
      default:
         return Promise.reject("Invalid email type");
   }

   const mailOptions = {
      from: process.env.EMAIL,
      to: toEmail,
      subject: subject,
      html: htmlContent,
   };

   return transporter.sendMail(mailOptions);
}

export { sendEmail };

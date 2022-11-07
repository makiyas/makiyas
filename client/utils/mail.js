import { transporter } from "../config/mail.js";

let sendMail = (mailOptions) => {
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Message sent: " + info.response);
        resolve(true);
      }
    });
  });
};

export default sendMail;

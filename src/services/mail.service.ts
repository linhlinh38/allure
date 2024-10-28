import { config } from "../configs/envConfig";
import { generateAccountRegisterContent } from "../utils/email";

const nodemailer = require("nodemailer");

export async function sendRegisterAccountEmail(
  username: string,
  email: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD,
      },
    });

    const body = generateAccountRegisterContent(username);

    const mailOptions = {
      from: config.FROM_EMAIL,
      to: email,
      subject: "Allure: Validate Email",
      html: body.html,
      text: body.text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in sendRegisterAccountEmail:", error);
  }
}

import moment from "moment";

export function generateAccountRegisterContent(username: string): {
  html: string;
  text: string;
} {
  const htmlContent = `
<body
  style="
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 12px 0;
  "
>
  <div>
    <p>Dear ${username},</p>
            <p>
              Please Click the link below to validate your email address
            </p>
            <a
              href="http://localhost:3000/allure/accounts/update"
              target="_blank"
              style="color: #0066cc; text-decoration: none"
              >Validate my email</a
            >
  </div>
</body>
`;

  const textContent = `
    Thank you for choosing Allure.`;
  return { html: htmlContent, text: textContent };
}

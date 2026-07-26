const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env
  if (
    !MAIL_HOST ||
    !MAIL_USER ||
    !MAIL_PASS ||
    [MAIL_HOST, MAIL_USER, MAIL_PASS].some((value) =>
      value.includes("replace_me") || value.includes("example.com")
    )
  ) {
    throw new Error(
      "Email service is not configured. Set MAIL_HOST, MAIL_USER, and MAIL_PASS in server/.env."
    )
  }

  const port = Number(MAIL_PORT || 587)
  const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
      secure: port === 465,
    })

  const info = await transporter.sendMail({
      from: `"StudyBuddy" <${MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    })
  return info
}

module.exports = mailSender

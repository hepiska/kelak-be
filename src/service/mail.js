import nodemailer from "nodemailer"
const { EMAILPASS, } = process.env


const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emailkelak01@gmail.com",
    pass: EMAILPASS
  }
})


export const sendTextEmail = ({ to, message, subject, }) => {
  const data = {
    from: "emailkelak01@gmail.com",
    subject,
    text: message,
    to,
  }

  return gmailTransporter.sendMail(data, (err, info) => {
    if (err) {
      console.error(err)
    }

    return info
  })

}

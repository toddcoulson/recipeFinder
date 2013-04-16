// Copy in your particulars and rename this to mail.js
module.exports = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secureConnection: false,
  //name: "servername",
  auth: {
    user: "tcoulson@gmail.com",
    pass: "marathon9"
  },
  ignoreTLS: false,
  debug: false,
  maxConnections: 5 // Default is 5
}

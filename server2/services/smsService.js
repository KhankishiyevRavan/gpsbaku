// services/smsService.js
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MSG_SERVICE_SID;

const client = twilio(accountSid, authToken);

async function sendSms(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      to: to,
      from: "gpsbaku.az",
      messagingServiceSid,
    });
    console.log("SMS göndərildi:", result.sid);
  } catch (error) {
    console.error("SMS xətası:", error);
  }
}

module.exports = { sendSms };

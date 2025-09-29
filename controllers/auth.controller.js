const db = require("../models");
const { sendSMS } = require("../config/sms");

const { OTP } = db;

function generateFourDigitCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return String(n);
}

function minutesFromNow(mins) {
  return new Date(Date.now() + mins * 60 * 1000);
}

async function send_otp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "phone is required" });
    }

    // Check existing OTP for this phone
    const existing = await OTP.findOne({ where: { phone }, order: [["created_at", "DESC"]] });
    const now = new Date();
    if (existing) {
      const remainingMs = existing.expires_at.getTime() - now.getTime();
      if (remainingMs > 0) {
        const remainingSec = Math.ceil(remainingMs / 1000);
        return res.status(429).json({ message: `لطفا ${remainingSec} ثانیه صبر کنید تا دوباره درخواست بدهید.` });
      }
      await existing.destroy();
    }

    const code = generateFourDigitCode();
    const expires_at = minutesFromNow(2);
    const otp = await OTP.create({ phone, code, expires_at, created_at: new Date() });

    // Send SMS
    await sendSMS(phone, `کد تایید شما: ${code}\nیونیتل`);

    return res.status(201).json({ message: "OTP sent successfully", expires_in_seconds: 120 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function verify_otp(req, res) {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ message: "شماره تلفن و کد الزامی هستند" });
    }

    const otp = await OTP.findOne({ where: { phone }, order: [["created_at", "DESC"]] });
    if (!otp) {
      return res.status(404).json({ message: "کد یافت نشد" });
    }

    const now = new Date();
    if (otp.expires_at.getTime() < now.getTime()) {
      await otp.destroy();
      return res.status(410).json({ message: "کد منسوخ شده است" });
    }

    if (otp.code !== String(code)) {
      return res.status(401).json({ message: "کد معتبر نیست" });
    }

    // Successful verification → delete the OTP
    await otp.destroy();

    return res.status(200).json({ message: "کد تایید شد" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  send_otp,
  verify_otp,
};



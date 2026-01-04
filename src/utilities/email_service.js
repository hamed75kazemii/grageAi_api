import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ایجاد transporter برای ارسال ایمیل
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true برای پورت 465، false برای سایر پورت‌ها
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// تابع ارسال ایمیل تأیید
export const sendVerificationEmail = async (email, verificationCode) => {
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET ✅" : "MISSING ❌");
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "کد تأیید ایمیل - Garage AI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;text-align:right; margin: 0 auto;">
        <h2 style="color: #333;">خوش آمدید</h2>
        <p>از ثبت نام شما در گاراژ هوشمند متشکریم</p>
        <p>کد تأیید ایمیل شما</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
        </div>
        <p>لطفاً این کد را در صفحه تأیید ایمیل وارد کنید.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          این کد تا 10 دقیقه معتبر است
        </p>
      </div>
    `,
    text: `
      خوش آمدید
      از ثبت نام شما در Garage AI متشکریم
    
      کد تأیید ایمیل شما: ${verificationCode}

      لطفاً این کد را در صفحه تأیید ایمیل وارد کنید
      این کد تا 10 دقیقه معتبر است
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("error in sending email");
  }
};

// تابع ارسال ایمیل فراموشی رمز عبور
export const sendForgotPasswordEmail = async (email, verificationCode) => {
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET ✅" : "MISSING ❌");
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "بازیابی رمز عبور - Garage AI",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;text-align:right; margin: 0 auto;">
        <h2 style="color: #333;">بازیابی رمز عبور</h2>
        <p>درخواست شما برای بازیابی رمز عبور دریافت شد</p>
        <p>کد بازیابی رمز عبور شما</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
        </div>
        <p>لطفاً این کد را در صفحه بازیابی رمز عبور وارد کنید</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          این کد تا 10 دقیقه معتبر است
        </p>
        <p style="color: #ff0000; font-size: 12px; margin-top: 20px;">
          اگر شما این درخواست را نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید
        </p>
      </div>
    `,
    text: `
      بازیابی رمز عبور
      درخواست شما برای بازیابی رمز عبور دریافت شد
    
      کد بازیابی رمز عبور شما: ${verificationCode}

      لطفاً این کد را در صفحه بازیابی رمز عبور وارد کنید
      این کد تا 10 دقیقه معتبر است

      اگر شما این درخواست را نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("error in sending email");
  }
};

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Greatinco Contact API is running 🚀");
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const {
      company_name,
      contact_name,
      email,
      phone,
      company_type,
      message,
      source_page,
      language
    } = req.body || {};

    if (
      !company_name ||
      !contact_name ||
      !email ||
      !phone ||
      !company_type ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        error: "Mohon lengkapi semua field."
      });
    }

    const safeSourcePage = source_page || "Contact-Us-ID.html";
    const safeLanguage = language || "ID";

    const mailOptions = {
      from: `"Greatinco Website" <${process.env.SMTP_USER}>`,
      to: process.env.TARGET_EMAIL,
      replyTo: email,
      subject: `New Website Inquiry - ${company_name}`,
      text: `
Halo Tim Marketing Greatinco,

Ada inquiry baru dari website.

================================
Nama Perusahaan : ${company_name}
Nama Kontak     : ${contact_name}
Email           : ${email}
Nomor Kontak    : ${phone}
Jenis Perusahaan: ${company_type}
================================

Pesan:
${message}

--------------------------------
Source Page: ${safeSourcePage}
Language   : ${safeLanguage}
--------------------------------
      `.trim(),
      html: `
        <p>Halo Tim Marketing Greatinco,</p>

        <p>Ada inquiry baru dari website.</p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td><b>Nama Perusahaan</b></td>
            <td>${company_name}</td>
          </tr>
          <tr>
            <td><b>Nama Kontak</b></td>
            <td>${contact_name}</td>
          </tr>
          <tr>
            <td><b>Email</b></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td><b>Nomor Kontak</b></td>
            <td>${phone}</td>
          </tr>
          <tr>
            <td><b>Jenis Perusahaan</b></td>
            <td>${company_type}</td>
          </tr>
        </table>

        <p><b>Pesan:</b></p>
        <p>${String(message).replace(/\n/g, "<br>")}</p>

        <hr />

        <p>
          <b>Source Page:</b> ${safeSourcePage}<br>
          <b>Language:</b> ${safeLanguage}
        </p>

        <p>Regards,<br>Greatinco Website Automation</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email berhasil dikirim."
    });
  } catch (err) {
    console.error("Send mail error:", err);

    return res.status(500).json({
      success: false,
      error: "Gagal mengirim email."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
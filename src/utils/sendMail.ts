import nodemailer from 'nodemailer';

type Optionsdetails = {
  email: string;
  subject: string;
  message: string;
};

const sendEmail = async (options: Optionsdetails) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST as string,
      port: parseInt(process.env.EMAIL_PORT as string),
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER as string,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;

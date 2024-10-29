import { mailtrapClient, sender } from "./mailtrap.config";

export const sendVerificationEmail = async (
  email: string,
  verificationToken: number
) => {
  const recipent = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "Verify your email",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 5px;">
      <h1 style="color: #333;">Verify Your Email</h1>
      <p style="color: #555;">Hi there,</p>
      <p style="color: #555;">Thank you for registering! Please verify your email by using the code below:</p>
      <p style="background-color: #fff; border: 1px solid #ddd; padding: 10px; border-radius: 4px; font-size: 18px; color: #333;">
        <strong>Your Verification Code:</strong> 
        <span style="font-weight: bold; color: #007BFF;">${verificationToken}</span>
      </p>
      <p style="color: #555;">If you didn't register for this account, please ignore this email.</p>
      <p style="color: #555;">Thank you,</p>
      <p style="color: #555;">The Team</p>
    </div>
  `,
      category: "Email Verification",
    });

    console.log("email send successfully", response);
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error(`Failed to send verification email ${error}`);
  }
};

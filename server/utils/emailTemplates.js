export function generateVerificationOtpEmailTemplate(otpCode, name) {
  return `
    <div style="background-color: #f4f4f4; padding: 40px; text-align: center; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">
          Verification Code
        </div>
        <div style="font-size: 16px; color: #555555; margin-bottom: 30px;">
          ${name} use the code below to verify your email address.
        </div>
        <div style="font-size: 32px; font-weight: bold; color: #4CAF50; margin-bottom: 30px;">
          ${otpCode}
        </div>
        <div style="font-size: 14px; color: #999999;">
          If you didn't request this, please ignore this email.
        </div>
        <div style="margin-top: 40px; font-size: 12px; color: #aaaaaa;">
          &copy; 2025 TrendZ. All rights reserved.
        </div>
      </div>
    </div>
`;
}

export function generateForgotPasswordEmailTemplate(url, name) {
  return `
    <div style="background-color: #f4f4f4; padding: 40px; text-align: center; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">
          Password Reset Request
        </div>
        <div style="font-size: 16px; color: #555555; margin-bottom: 30px;">
          You requested to reset your password. Click the button below to reset it.
        </div>
        <div style="margin-bottom: 30px;">
          <div style="display: inline-block; background-color: #4CAF50; padding: 12px 24px; border-radius: 8px; text-decoration: none; color: #ffffff; font-weight: bold;">
            <a href="${url}" style="text-decoration: none; color: #ffffff;">Reset Password</a>
          </div>
        </div>
        <div style="font-size: 14px; color: #999999;">
          If you didn't request this, please ignore this email.
        </div>
        <div style="margin-top: 40px; font-size: 12px; color: #aaaaaa;">
          &copy; 2025 TrendZ. All rights reserved.
        </div>
      </div>
    </div>
`;
}

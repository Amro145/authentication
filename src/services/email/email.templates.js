export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: 'Outfit', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Verify Your Email</h1>
  </div>
  <div style="background-color: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; border-top: none;">
    <p style="font-size: 16px; color: #64748b;">Hello <strong>{userName}</strong>,</p>
    <p style="font-size: 16px; color: #64748b;">Thank you for joining us! To complete your registration, please use the verification code below:</p>
    <div style="text-align: center; margin: 40px 0;">
      <div style="display: inline-block; padding: 16px 32px; background-color: #f1f5f9; border-radius: 12px; border: 2px dashed #cbd5e1;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #6366f1;">{verificationCode}</span>
      </div>
    </div>
    <p style="font-size: 14px; color: #94a3b8; text-align: center;">This code will expire in <strong>15 minutes</strong> for security reasons.</p>
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 14px; color: #64748b;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Best regards,<br><strong>Amro Altayeb</strong></p>
    </div>
  </div>
  <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
    <p>This is an automated message from your Authentication App.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: 'Outfit', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
    <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; margin-bottom: 16px;">
        <span style="color: white; font-size: 30px;">✓</span>
    </div>
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Password Updated</h1>
  </div>
  <div style="background-color: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; border-top: none;">
    <p style="font-size: 16px; color: #64748b;">Hello <strong>{userName}</strong>,</p>
    <p style="font-size: 16px; color: #64748b;">Your password has been successfully reset. You can now log in to your account with your new credentials.</p>
    <div style="text-align: center; margin: 40px 0;">
      <a href="{loginURL}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">Back to Login</a>
    </div>
    <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 12px;">
        <p style="font-size: 14px; color: #92400e; margin: 0;"><strong>Security Note:</strong> If you did not initiate this change, please contact our support team immediately as your account may be at risk.</p>
    </div>
    <p style="margin-top: 32px; font-size: 14px; color: #64748b; margin-bottom: 0;">Best regards,<br><strong>Your App Team</strong></p>
  </div>
  <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
    <p>This is an automated security notification.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'Outfit', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Password Reset</h1>
  </div>
  <div style="background-color: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; border-top: none;">
    <p style="font-size: 16px; color: #64748b;">Hello <strong>{userName}</strong>,</p>
    <p style="font-size: 16px; color: #64748b;">We received a request to reset your password. No problem! Just click the secure button below to choose a new one:</p>
    <div style="text-align: center; margin: 40px 0;">
      <a href="{resetURL}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #94a3b8; text-align: center;">This link will expire in <strong>1 hour</strong> for security reasons.</p>
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 14px; color: #64748b;">If you didn't request a password reset, you can safely ignore this email and nothing will change.</p>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Best regards,<br><strong>Your App Team</strong></p>
    </div>
  </div>
  <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
    <p>This is an automated message from your Authentication App.</p>
  </div>
</body>
</html>
`;
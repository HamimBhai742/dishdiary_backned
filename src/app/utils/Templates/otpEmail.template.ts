/**
 * HTML Email Template for 6-Digit Password Reset OTP
 */
export const getOtpEmailTemplate = (name: string, otp: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your DishDiary Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fcfaf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292524;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfaf8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #fed7aa; box-shadow: 0 4px 20px rgba(234, 88, 12, 0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 32px 24px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 36px; line-height: 1;">🍳</span>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Dish<span style="color: #fed7aa;">Diary</span></h1>
                    <p style="margin: 4px 0 0 0; color: #ffedd5; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">Culinary Security</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 24px 32px;">
              <h2 style="margin: 0 0 12px 0; color: #1c1917; font-size: 20px; font-weight: 700;">Hello Chef ${name || "Foodie"},</h2>
              <p style="margin: 0 0 24px 0; color: #57534e; font-size: 15px; line-height: 1.6;">
                We received a request to reset the password for your DishDiary account. Use the 6-digit verification code below to proceed:
              </p>

              <!-- OTP Code Display Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #fff7ed; border: 2px dashed #f97316; border-radius: 14px; padding: 22px 16px;">
                    <span style="display: block; font-size: 12px; color: #9a3412; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your One-Time Verification Code</span>
                    <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #ea580c; letter-spacing: 10px; padding-left: 10px;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                  ⏱️ <strong>This code will expire in 10 minutes.</strong> Never share this code with anyone. DishDiary staff will never ask for your verification code.
                </p>
              </div>

              <p style="margin: 0; color: #78716c; font-size: 14px; line-height: 1.6;">
                If you did not make this request, you can safely ignore this email. Your password will remain unchanged and your dishes stay secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #a8a29e; font-size: 12px;">
                © 2026 DishDiary — Discover, Cook & Share Wonderful Recipes.
              </p>
              <p style="margin: 0; color: #d6d3d1; font-size: 11px;">
                This automated security email was sent to your registered account address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

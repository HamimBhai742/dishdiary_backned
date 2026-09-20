/**
 * HTML Email Template for Password Reset Success Confirmation
 */
export const getPasswordResetSuccessTemplate = (name: string): string => {
  const formattedDate = new Date().toUTCString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful - DishDiary</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fcfaf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292524;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfaf8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #fed7aa; box-shadow: 0 4px 20px rgba(234, 88, 12, 0.08); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 32px 24px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 36px; line-height: 1;">🛡️</span>
                    <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Password Reset Successful</h1>
                    <p style="margin: 4px 0 0 0; color: #bbf7d0; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">Account Security Confirmed</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 24px 32px;">
              <h2 style="margin: 0 0 12px 0; color: #1c1917; font-size: 20px; font-weight: 700;">Hello Chef ${name || "Foodie"},</h2>
              <p style="margin: 0 0 20px 0; color: #57534e; font-size: 15px; line-height: 1.6;">
                The password for your DishDiary account was successfully updated on <strong>${formattedDate}</strong>.
              </p>

              <!-- Success Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px;">
                    <p style="margin: 0 0 6px 0; color: #166534; font-size: 14px; font-weight: 700;">
                      ✓ Your new password is now active
                    </p>
                    <p style="margin: 0; color: #15803d; font-size: 13px; line-height: 1.5;">
                      You can now use your updated password to sign in and continue exploring, publishing, and saving your favorite culinary dishes.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warning Alert -->
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
                  ⚠️ <strong>Did not perform this action?</strong> If you did not request this password reset, please contact support immediately or secure your email account.
                </p>
              </div>

              <p style="margin: 0; color: #78716c; font-size: 14px; line-height: 1.6;">
                Thank you for being part of the DishDiary culinary community.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafaf9; border-top: 1px solid #f5f5f4; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #a8a29e; font-size: 12px;">
                © 2026 DishDiary — Discover, Cook & Share Wonderful Recipes.
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

/**
 * Email Templates for BumpWin Flight Alerts
 * 
 * These templates are used by the email notification system to alert users
 * about flight status changes and potential compensation eligibility.
 */

export interface FlightAlertData {
  userName: string;
  userEmail: string;
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  flightDate: string;
  delayMinutes?: number;
  ticketPrice?: number;
  estimatedCompensation?: number;
}

/**
 * Generate HTML email for flight delay alert
 */
export function generateDelayAlertEmail(data: FlightAlertData): { subject: string; html: string; text: string } {
  const delayHours = data.delayMinutes ? Math.floor(data.delayMinutes / 60) : 0;
  const delayMins = data.delayMinutes ? data.delayMinutes % 60 : 0;
  const delayText = `${delayHours}h ${delayMins}m`;

  const subject = `⏰ Your ${data.airlineCode} ${data.flightNumber} flight is delayed`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flight Delay Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; color: #a3e635; font-size: 24px; font-weight: bold;">BUMPWIN</h1>
            </td>
          </tr>
          
          <!-- Alert Banner -->
          <tr>
            <td style="padding: 30px; background-color: #f59e0b20; border-bottom: 1px solid #f59e0b40;">
              <h2 style="margin: 0 0 10px 0; color: #fbbf24; font-size: 20px;">⏰ Flight Delay Detected</h2>
              <p style="margin: 0; color: #fcd34d; font-size: 14px;">Your flight has been delayed by <strong>${delayText}</strong></p>
            </td>
          </tr>
          
          <!-- Flight Details -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background-color: #0f172a; border-radius: 8px;">
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Flight</p>
                    <p style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${data.airlineCode} ${data.flightNumber}</p>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">${data.airlineName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 10px; background-color: #0f172a; border-radius: 8px 0 0 8px;">
                          <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px;">DATE</p>
                          <p style="margin: 0; color: #ffffff; font-size: 16px;">${data.flightDate}</p>
                        </td>
                        <td width="50%" style="padding: 10px; background-color: #0f172a; border-radius: 0 8px 8px 0;">
                          <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px;">DELAY</p>
                          <p style="margin: 0; color: #ef4444; font-size: 16px; font-weight: bold;">${delayText}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <div style="margin-top: 20px; padding: 20px; background-color: #0f172a; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0 0 10px 0; color: #fbbf24; font-weight: bold;">What does this mean?</p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  While US law doesn't require cash compensation for delays, you may be able to:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
                  <li>Request meal vouchers from the airline</li>
                  <li>Ask for hotel accommodation if overnight</li>
                  <li>Request rebooking on the next available flight</li>
                  <li>File a complaint with the DOT</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://bumpwin.com/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #a3e635; color: #0f172a; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px;">
                  View Your Flight Status
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0f172a; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                You're receiving this because you enabled flight alerts on BumpWin.
              </p>
              <p style="margin: 10px 0 0 0; color: #64748b; font-size: 12px;">
                <a href="https://bumpwin.com/dashboard" style="color: #a3e635; text-decoration: none;">Manage alerts</a> · 
                <a href="https://bumpwin.com/terms" style="color: #64748b; text-decoration: none;">Terms</a> · 
                <a href="https://bumpwin.com/privacy" style="color: #64748b; text-decoration: none;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
BUMPWIN - Flight Delay Alert

Your flight ${data.airlineCode} ${data.flightNumber} (${data.airlineName}) on ${data.flightDate} has been delayed by ${delayText}.

What does this mean?
While US law doesn't require cash compensation for delays, you may be able to:
- Request meal vouchers from the airline
- Ask for hotel accommodation if overnight
- Request rebooking on the next available flight
- File a complaint with the DOT

View your flight status: https://bumpwin.com/dashboard

---
You're receiving this because you enabled flight alerts on BumpWin.
  `;

  return { subject, html, text };
}

/**
 * Generate HTML email for flight cancellation alert
 */
export function generateCancellationAlertEmail(data: FlightAlertData): { subject: string; html: string; text: string } {
  const subject = `❌ Your ${data.airlineCode} ${data.flightNumber} flight has been CANCELLED`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; color: #a3e635; font-size: 24px; font-weight: bold;">BUMPWIN</h1>
            </td>
          </tr>
          
          <!-- Alert Banner -->
          <tr>
            <td style="padding: 30px; background-color: #ef444420; border-bottom: 1px solid #ef444440;">
              <h2 style="margin: 0 0 10px 0; color: #f87171; font-size: 20px;">❌ Flight Cancelled</h2>
              <p style="margin: 0; color: #fca5a5; font-size: 14px;">Your flight has been cancelled by the airline</p>
            </td>
          </tr>
          
          <!-- Flight Details -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background-color: #0f172a; border-radius: 8px;">
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Flight</p>
                    <p style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${data.airlineCode} ${data.flightNumber}</p>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">${data.airlineName}</p>
                    <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Scheduled: ${data.flightDate}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Your Rights Box -->
              <div style="margin-top: 20px; padding: 20px; background-color: #a3e63510; border-radius: 8px; border-left: 4px solid #a3e635;">
                <p style="margin: 0 0 10px 0; color: #a3e635; font-weight: bold;">✅ Your Rights</p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  For cancelled flights, you are entitled to:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
                  <li><strong style="color: #ffffff;">Full refund</strong> to your original payment method</li>
                  <li>Rebooking on the next available flight at no extra cost</li>
                  <li>Meal vouchers and hotel if you're stranded overnight</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://bumpwin.com/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #a3e635; color: #0f172a; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px;">
                  File Your Complaint
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0f172a; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                You're receiving this because you enabled flight alerts on BumpWin.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
BUMPWIN - Flight Cancellation Alert

Your flight ${data.airlineCode} ${data.flightNumber} (${data.airlineName}) scheduled for ${data.flightDate} has been CANCELLED.

Your Rights:
- Full refund to your original payment method
- Rebooking on the next available flight at no extra cost
- Meal vouchers and hotel if you're stranded overnight

File your complaint: https://bumpwin.com/dashboard
  `;

  return { subject, html, text };
}

/**
 * Generate HTML email for bumping eligibility alert
 */
export function generateBumpingAlertEmail(data: FlightAlertData): { subject: string; html: string; text: string } {
  const compensation = data.estimatedCompensation || 1550;
  
  const subject = `💰 You may be owed up to $${compensation} - ${data.airlineCode} ${data.flightNumber} overbooking`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; color: #a3e635; font-size: 24px; font-weight: bold;">BUMPWIN</h1>
            </td>
          </tr>
          
          <!-- Alert Banner - GREEN for money! -->
          <tr>
            <td style="padding: 30px; background-color: #a3e63520; border-bottom: 1px solid #a3e63540;">
              <h2 style="margin: 0 0 10px 0; color: #a3e635; font-size: 20px;">💰 Cash Compensation Available!</h2>
              <p style="margin: 0; color: #bef264; font-size: 14px;">Your flight appears to be overbooked - you may be entitled to compensation</p>
            </td>
          </tr>
          
          <!-- Compensation Amount -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase;">Potential Compensation</p>
              <p style="margin: 0; color: #a3e635; font-size: 48px; font-weight: bold;">Up to $${compensation}</p>
              <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 14px;">Under 14 CFR Part 250</p>
            </td>
          </tr>
          
          <!-- Flight Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background-color: #0f172a; border-radius: 8px;">
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Flight</p>
                    <p style="margin: 0; color: #ffffff; font-size: 20px; font-weight: bold;">${data.airlineCode} ${data.flightNumber}</p>
                    <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">${data.airlineName} · ${data.flightDate}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Important Info -->
              <div style="margin-top: 20px; padding: 20px; background-color: #0f172a; border-radius: 8px; border-left: 4px solid #a3e635;">
                <p style="margin: 0 0 10px 0; color: #a3e635; font-weight: bold;">⚡ Act Now</p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  If you're involuntarily denied boarding due to overbooking, US law <strong style="color: #ffffff;">requires</strong> the airline to pay you cash compensation:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
                  <li>1-2 hour delay: <strong style="color: #ffffff;">200% of fare</strong> (max $775)</li>
                  <li>2+ hour delay: <strong style="color: #ffffff;">400% of fare</strong> (max $1,550)</li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://bumpwin.com/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #a3e635; color: #0f172a; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px;">
                  Claim Your Compensation
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0f172a; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                You're receiving this because you enabled flight alerts on BumpWin.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
BUMPWIN - Compensation Alert!

Your flight ${data.airlineCode} ${data.flightNumber} (${data.airlineName}) on ${data.flightDate} appears to be overbooked.

POTENTIAL COMPENSATION: Up to $${compensation}

If you're involuntarily denied boarding, US law REQUIRES the airline to pay you:
- 1-2 hour delay: 200% of fare (max $775)
- 2+ hour delay: 400% of fare (max $1,550)

Claim your compensation: https://bumpwin.com/dashboard
  `;

  return { subject, html, text };
}

/**
 * Generate welcome email when user starts tracking a flight
 */
export function generateTrackingConfirmationEmail(data: FlightAlertData): { subject: string; html: string; text: string } {
  const subject = `✅ Now tracking ${data.airlineCode} ${data.flightNumber}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #334155;">
              <h1 style="margin: 0; color: #a3e635; font-size: 24px; font-weight: bold;">BUMPWIN</h1>
            </td>
          </tr>
          
          <!-- Success Message -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: #a3e63520; border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 30px;">✈️</span>
              </div>
              <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px;">Flight Tracking Active</h2>
              <p style="margin: 0; color: #94a3b8; font-size: 16px;">We'll monitor your flight and alert you if anything changes</p>
            </td>
          </tr>
          
          <!-- Flight Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 20px; background-color: #0f172a; border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Tracking</p>
                    <p style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${data.airlineCode} ${data.flightNumber}</p>
                    <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 14px;">${data.airlineName}</p>
                    <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">${data.flightDate}</p>
                  </td>
                </tr>
              </table>
              
              <!-- What We Monitor -->
              <div style="margin-top: 20px; padding: 20px; background-color: #0f172a; border-radius: 8px;">
                <p style="margin: 0 0 15px 0; color: #ffffff; font-weight: bold;">We'll alert you about:</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">⏰ Significant delays (3+ hours)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">❌ Flight cancellations</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">🚫 Overbooking situations</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">💰 Compensation eligibility</td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://bumpwin.com/dashboard" style="display: inline-block; padding: 16px 32px; background-color: #a3e635; color: #0f172a; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px;">
                  View Dashboard
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0f172a; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                Safe travels! We've got your back.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
BUMPWIN - Flight Tracking Active

We're now monitoring your flight:
${data.airlineCode} ${data.flightNumber} (${data.airlineName})
Date: ${data.flightDate}

We'll alert you about:
- Significant delays (3+ hours)
- Flight cancellations
- Overbooking situations
- Compensation eligibility

View your dashboard: https://bumpwin.com/dashboard

Safe travels!
  `;

  return { subject, html, text };
}



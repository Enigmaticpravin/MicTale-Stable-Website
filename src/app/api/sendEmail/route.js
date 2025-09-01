// app/api/sendEmail/route.js
import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, txnid, amount } = body;

    if (!email || !name || !txnid || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Client-specific styles */
    #outlook a { padding: 0; }
    body { width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    * { font-family: 'Poppins', Arial, sans-serif; }
    .wrapper { background-color: #f5f5f5; background-image: url('https://i.imgur.com/gVGBPTj.jpg'); background-blend-mode: overlay; opacity: 0.95; }
    .container { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .book-cover { width: 150px !important; height: auto !important; }
      .product-details { padding: 15px !important; }
      .mobile-padding { padding: 15px !important; }
      .header-text { font-size: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper" style="width: 100%; padding: 40px 0; background-color: #f5f5f5; background-image: url('https://i.imgur.com/gVGBPTj.jpg'); background-size: cover; background-position: center;">
    <center>
      <table style="max-width: 600px; background-color: rgba(255, 255, 255, 0.95); border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
        <tbody>
          <tr>
            <td style="padding: 50px 0; background: linear-gradient(135deg, rgba(26, 35, 126, 0.95) 0%, rgba(13, 71, 161, 0.95) 100%); border-radius: 12px 12px 0 0;" align="center">
              <table style="max-width: 400px;" border="0" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td align="center">
                      <img style="display: block; width: 180px; margin-bottom: 25px;" src="https://i.imgur.com/rnRHgRm.png" alt="Bookstore Logo">
                      <h1 class="header-text" style="color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 1px;">Order Confirmation</h1>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <table border="0" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td style="color: #333333; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0; font-size: 20px; font-weight: 500;">Dear ${name} Ji,</p>
                      <p style="margin: 20px 0 0 0; color: #666666; font-weight: 300; line-height: 1.6;">
                        Thank you for ordering 'Kaalikh'. Your order for the author-signed edition has been received and confirmed.
                        We will dispatch your parcel soon and send across the tracking details accordingly.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px;">
              <table style="background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" border="0" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td class="mobile-padding" style="padding: 25px;" width="160">
                      <img class="book-cover" style="display: block; width: 160px; height: 240px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);" src="https://i.imgur.com/mWVluEh.png" alt="Kaalikh Book Cover">
                    </td>
                    <td class="product-details" style="padding: 25px; vertical-align: top;">
                      <table border="0" width="100%" cellspacing="0" cellpadding="0">
                        <tbody>
                          <tr>
                            <td style="color: #1a237e; font-size: 22px; font-weight: 600; padding-bottom: 15px;">
                              Kaalikh
                              <p style="margin: 5px 0 0 0; font-size: 16px; color: #666666; font-weight: 400;">Paperback, Author-Signed Edition</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; line-height: 24px; color: #666666;">
                              <table style="margin-top: 10px;" border="0" width="100%" cellspacing="0" cellpadding="0">
                                <tbody>
                                  <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                      <strong style="color: #333;">Edition:</strong>
                                      <span style="float: right;">Revised Edition, 2024</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                      <strong style="color: #333;">Language:</strong>
                                      <span style="float: right;">Hindi</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 0;background-color:#1a237e;border-radius:0 0 12px 12px" align="center">
              <p style="margin:0;color:#ffffff;font-family:'Poppins',Arial,sans-serif;font-size:14px;line-height:24px;">
                Thank you for ordering 'Kaalikh'!
              </p>
              <p style="margin:0;color:#ffffff;font-family:'Poppins',Arial,sans-serif;font-size:14px;line-height:24px;">
                Need assistance? 
                <a href="mailto:pravingupta2020@gmail.com" style="color:#bbdefb;text-decoration:none;" target="_blank">
                  Contact Support
                </a>
              </p>
              <p style="margin-top:10px;font-size:12px;color:#bbdefb;">
                © 2024 Nymoria Press. All rights reserved.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  </div>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "contact@mictale.in",
      to: email,
      subject: "Order Confirmation - Your Purchase Details",
      html,
    });

    return NextResponse.json({ message: "Email sent successfully", emailResponse });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

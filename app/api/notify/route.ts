import nodemailer from "nodemailer";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "Invalid email" }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,        // Your email address
            pass: process.env.EMAIL_PASSWORD,    // App-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to VikaasGarh - You're on the waitlist!",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #00b0ff; font-size: 28px; margin: 0;">VikaasGarh</h1>
                    <p style="color: #00b0ff; font-size: 14px; margin: 5px 0;">An initiative by Vigsia Global</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #00b0ff20, #0066ff20); padding: 30px; border-radius: 15px; border: 1px solid #00b0ff30;">
                    <h2 style="color: #00b0ff; text-align: center; margin-bottom: 20px;">You're on the waitlist! 🎉</h2>
                    
                    <p style="color: #ccc; line-height: 1.6; text-align: center;">
                        Thank you for joining the VikaasGarh waitlist! We're excited to have you on board.
                    </p>
                    
                    <p style="color: #ccc; line-height: 1.6; text-align: center;">
                        We'll notify you as soon as we launch on <strong style="color: #00b0ff;">July 21, 2025</strong>.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #00b0ff; font-size: 18px; margin: 0;">🚀 Get ready for something amazing!</p>
                    </div>
                    
                    <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                        Stay tuned for updates and exclusive content.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #666; font-size: 12px;">
                        © 2025 VikaasGarh. All rights reserved.
                    </p>
                </div>
            </div>
        `,
        text: `Welcome to VikaasGarh!

Thank you for joining our waitlist! We're excited to have you on board.

We'll notify you as soon as we launch on July 21, 2025.

Get ready for something amazing!

© 2025 VikaasGarh. All rights reserved.
An initiative by Vigsia Global`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: "Email sent successfully!" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Email send error:", error);
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
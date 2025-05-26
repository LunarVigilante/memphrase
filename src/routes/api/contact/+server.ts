import type { RequestHandler } from './$types';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

// Environment variables with fallbacks for build compatibility
const SMTP_HOST = env.SMTP_HOST;
const SMTP_PORT = env.SMTP_PORT;
const SMTP_USER = env.SMTP_USER;
const SMTP_PASS = env.SMTP_PASS;
const EMAIL_TO_ADDRESS = env.EMAIL_TO_ADDRESS;
const EMAIL_FROM_ADDRESS = env.EMAIL_FROM_ADDRESS;
const RECAPTCHA_V2_SECRET_KEY = env.RECAPTCHA_V2_SECRET_KEY;

// Basic email validation regex (not exhaustive, but good for most cases)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ request, fetch: svelteKitFetch }) => {
    try {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const subject = data.get('subject') as string;
        const message = data.get('message') as string;
        const recaptchaResponse = data.get('g-recaptcha-response') as string;

        // --- Validation ---
        if (!name || !email || !subject || !message) {
            return new Response(JSON.stringify({ message: 'All fields are required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ message: 'Invalid email address format.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (subject.trim() === '') {
            return new Response(JSON.stringify({ message: 'Subject cannot be blank.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // --- reCAPTCHA Verification ---
        if (!RECAPTCHA_V2_SECRET_KEY) {
            console.error('reCAPTCHA secret key is not set.');
            return new Response(JSON.stringify({ message: 'Server configuration error (reCAPTCHA).' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (!recaptchaResponse) {
            return new Response(JSON.stringify({ message: 'reCAPTCHA verification failed. Please try again.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_V2_SECRET_KEY}&response=${recaptchaResponse}`;
        const recaptchaVerification = await svelteKitFetch(verificationURL, { method: 'POST' });
        const verificationJson = await recaptchaVerification.json();

        if (!verificationJson.success) {
            console.error('reCAPTCHA verification failed:', verificationJson['error-codes']);
            return new Response(JSON.stringify({ message: 'reCAPTCHA verification failed. Are you a robot?' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // --- End reCAPTCHA Verification ---

        // --- Email Sending Logic ---
        if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_TO_ADDRESS || !EMAIL_FROM_ADDRESS) {
            console.error('SMTP environment variables are not set.');
            return new Response(JSON.stringify({ message: 'Server configuration error.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT, 10),
            secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `\"${name}\" <${EMAIL_FROM_ADDRESS}>`, // Use a generic from address, actual user email in replyTo
            replyTo: email, // So you can reply directly to the user
            to: EMAIL_TO_ADDRESS, // This comes from your .env file
            subject: subject, // This is the subject entered by the customer
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `<p><strong>Name:</strong> ${name}</p>\n                   <p><strong>Email:</strong> ${email}</p>\n                   <p><strong>Message:</strong></p>\n                   <p>${message.replace(/\n/g, '<br>')}</p>`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        return new Response(JSON.stringify({ message: 'Failed to send message. Please try again later.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 
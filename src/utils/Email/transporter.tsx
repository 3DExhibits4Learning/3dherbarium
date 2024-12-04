/**
 * @file transporter.tsx
 * @fileoverview Server component that exports a nodemailer transporter (https://nodemailer.com/)
 */

import nodemailer from 'nodemailer'

/**
 * @deprecated use sendHTMLEmail
 */
export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT as string),
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
    }
})
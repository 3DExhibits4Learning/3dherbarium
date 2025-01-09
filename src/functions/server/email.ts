/**
 * @file src/functions/server/email.ts
 * 
 * @fileoverview server email functions
 */

// Imports
import { serverErrorHandler } from './error'
import nodemailer from 'nodemailer'

const path = 'src/functions/server/email.ts'

/**
 * @description nodemailer transporter
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

/**
 * 
 * @param email recipient email address
 * @param subject email subject line
 * @param html email body HTML
 */
export const sendHTMLEmail = async (email: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: subject,
        html: html,
    }).catch((e: any) => serverErrorHandler(path, e.message, "Couldn't send email", 'sendHTMLEmail', true))
}

export const sendErrorEmail = async (route: string, fn: string, errorMessage: string, nonFatal?: boolean, method?: string) => {
    
    const html = `Date: ${new Date().toDateString()}\n
    Time: ${new Date().toTimeString()}\n
    Route: ${route} \n 
    Fatal: ${nonFatal ? "No" : "Yes"}\n
    HTTPMethod: ${method ? method : 'N/A'}\n
    Function: ${fn} \n
    Error Message: ${errorMessage}`

    sendHTMLEmail('ab632@humboldt.edu', '3D Herbarium Error', html)
}
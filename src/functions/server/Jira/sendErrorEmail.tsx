import nodemailer from 'nodemailer'

export default async function sendErrorEmail(message: string, action: string){
    
        const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string),
        secure: true,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'ab632@humboldt.edu',
        subject: 'Jira Create/Update Error',
        html: `Jira error message: ${message}<br> ${action}`,
    }).catch((e: any) => console.log(e.message))
}   
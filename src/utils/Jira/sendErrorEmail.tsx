import nodemailer from 'nodemailer'

export default async function sendErrorEmail(message: string){
    
    // Commented until noreply server is functional
    
    //     const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: parseInt(process.env.EMAIL_SERVER_PORT as string),
    //     secure: true,
    //     auth: {
    //         user: process.env.EMAIL_SERVER_USER,
    //         pass: process.env.EMAIL_SERVER_PASSWORD
    //     }
    // })

    // await transporter.sendMail({
    //     from: process.env.EMAIL_FROM,
    //     to: 'ab632@humboldt.edu',
    //     subject: 'Jira Create/Update Error',
    //     text: `Jira error message: ${message}`,
    //     html: 'This is an <b>IMPORTANT</b> notification'
    // }).catch((e: any) => console.log(e.message))
}   
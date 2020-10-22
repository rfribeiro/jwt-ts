const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

interface MailData {
    from: string;
    to: string;
    subject: string;
    html: string;
    context: {
        token: string;
    }
}

class Mail {
    transport: any;

    constructor() {
        this.transport = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey: process.env.SENDGRID_API_KEY
            })
        )
        this.transport.use('compile', hbs({
            viewEngine: {
                partialsDir: 'partials/',
                defaultLayout: false
              },
            viewPath: path.resolve('./src/resources/mail/'),
            extName: '.html',
        }));
    }

    async send(params: MailData) {
        console.log(params)
        await this.transport.sendMail({
            to: params.to, 
            from: params.from,
            template: params.html,
            context: params.context
        })
    }
}

export default new Mail()
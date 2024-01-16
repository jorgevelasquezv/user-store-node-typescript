import { createTransport, Transporter } from 'nodemailer';

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

export interface Attachment {
    filename: string;
    path: string;
}

export class EmailServices {
    private transporter: Transporter;

    constructor(
        mailerServices: string,
        mailerEmail: string,
        mailerEmailPassword: string,
        private readonly postToProvider: boolean
    ) {
        this.transporter = createTransport({
            service: mailerServices,
            auth: {
                user: mailerEmail,
                pass: mailerEmailPassword,
            },
        });
    }

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options;

        try {
            if (!this.postToProvider) return true;

            await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments,
            });

            return true;
        } catch (error) {
            return false;
        }
    }
}

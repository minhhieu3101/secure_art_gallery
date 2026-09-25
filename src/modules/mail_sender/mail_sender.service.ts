import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailSenderService {
    private nodemailerTransport: Transporter;

    constructor(private readonly configService: ConfigService) {
        this.nodemailerTransport = createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: Number(this.configService.get<string>('MAIL_PORT')),
            secure: false,

            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });
    }

    async sendMail(email: string) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            await this.nodemailerTransport.sendMail({
                from: this.configService.get<string>('MAIL_FROM'),
                to: email,
                subject: 'Verify Your Account',
                html: `
          <p>
            Enter <b>${otp}</b> to verify your email address.
          </p>
        `,
            });

            return otp;
        } catch (err) {
            throw err;
        }
    }
}

import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { IEmailLocals, winstonLogger } from '@sarthak0085/freelancer-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationMailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals) {
    try {
        emailTemplates(template, receiverEmail, locals);
        log.info('Email Sent Successfully');
    } catch (error) {
        log.log('error', 'NotificationServer MailTransport sendEmail() method error: ', error);
    }
}

export { sendEmail };
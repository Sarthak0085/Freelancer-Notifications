import 'express-async-errors';
import http from 'http';

import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages } from '@notifications/queues/email.consumer';
import { winstonLogger } from '@sarthak0085/freelancer-shared';


const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
    startServer(app);
    app.use('', healthRoutes());
    startQueues();
    startElasticSearch();
}

async function startQueues(): Promise<void> {
    const emailChannel = await createConnection() as Channel;
    await consumeAuthEmailMessages(emailChannel);
}

function startElasticSearch(): void {
    checkConnection();
}

const startServer = (app: Application): void => {
    try {
        const httpServer: http.Server = new http.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notification server running on port ${SERVER_PORT}`);
        });
    } catch (error) {
        log.log('error', 'NotificationService startServer() method:', error);
    }
};

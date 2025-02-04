import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healthRoutes(): Router {
    router.get('notifications-health', (_req: Request, res: Response) => {
        res.status(StatusCodes.OK).send('Notification Service is healthy and Ok.');
    });
    return router;
}
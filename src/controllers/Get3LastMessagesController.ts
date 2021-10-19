import { Request, Response } from 'express';

import { get3LastMessagesService } from '../services/Get3LastMessagesService';

export class get3LastMessagesController {
  async handle(req: Request, res: Response) {
    const service = new get3LastMessagesService();
    const messages = await service.execute();

    return res.json({
      messages,
    });
  }
}

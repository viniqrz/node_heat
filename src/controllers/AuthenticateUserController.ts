import { Request, response, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { code } = req.body;

    const service = new AuthenticateUserService();

    try {
      const result = await service.execute(code as string);
      res.json(result);
    } catch (err: any) {
      res.json({ error: err.message });
    }
  }
}

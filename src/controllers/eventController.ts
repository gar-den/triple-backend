import { Request, Response } from 'express';

import { EventType, ICreateEventInput } from '../interfaces/events';

exports.create = async (req: Request<{}, {}, ICreateEventInput>, res: Response) => {
  const { type } = req.body;

  let point = 0;

  if (type === EventType.REVIEW) {
    reviewEvent(req.body);
  }

  res.json({ message: 'done' });
};

async function reviewEvent(data: ICreateEventInput) {

}

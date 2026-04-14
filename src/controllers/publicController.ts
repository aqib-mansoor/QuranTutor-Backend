import { Request, Response } from 'express';
import { TrialRequest } from '../models/TrialRequest.ts';
import { sendSuccess, sendError } from '../utils/response.ts';

export const submitTrialRequest = async (req: Request, res: Response) => {
  try {
    const trialRequest = new TrialRequest(req.body);
    await trialRequest.save();
    sendSuccess(res, trialRequest, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

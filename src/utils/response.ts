import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, status: number = 200) => {
  res.status(status).json({ success: true, data });
};

export const sendError = (res: Response, error: string, code: number = 400) => {
  res.status(code).json({ success: false, error, code });
};

export const getPagination = (query: any) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

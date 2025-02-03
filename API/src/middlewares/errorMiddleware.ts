import { Request, Response, NextFunction } from 'express';

interface ErrorResponse extends Error {
  statusCode?: number;
  stack?: string;
}

export const errorMiddleware = (
  err: ErrorResponse, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {

  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    message,
    stack, 
  });
};

export const validationErrorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: err.message || 'Validation failed',
      errors: err.errors, 
    });
  } else {
    next(err); 
  }
};

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ApiBaseException } from '../exceptions/base/api-base.exception';

// Helper type para respuestas de error de NestJS
type NestExceptionResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

// Type guard personalizado
function isNestExceptionResponse(obj: any): obj is NestExceptionResponse {
  return typeof obj === 'object' && obj !== null;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. Manejo de excepciones personalizadas
    if (exception instanceof ApiBaseException) {
      const status = exception.getStatus();
      const errorResponse: ApiResponse<null> = {
        success: false,
        message: exception.message,
        error: {
          code: exception.code,
          details: exception.details || [exception.message],
        },
        timestamp: new Date(),
      };
      return response.status(status).json(errorResponse);
    }

    // 2. Manejo de HttpException estándar
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let details: string[];
      if (typeof exceptionResponse === 'string') {
        details = [exceptionResponse];
      } else if (isNestExceptionResponse(exceptionResponse)) {
        details = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message || exception.message];
      } else {
        details = [exception.message || 'Error desconocido'];
      }

      const errorResponse: ApiResponse<null> = {
        success: false,
        message: details.join(', '),
        error: {
          code: `HTTP-${status}`,
          details,
        },
        timestamp: new Date(),
      };
      return response.status(status).json(errorResponse);
    }

    // 3. Manejo de Error genérico
    if (exception instanceof Error) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        message: exception.message,
        error: {
          code: 'HTTP-500',
          details: [exception.message],
        },
        timestamp: new Date(),
      };
      return response.status(500).json(errorResponse);
    }

    // 4. Fallback para errores totalmente desconocidos
    const errorResponse: ApiResponse<null> = {
      success: false,
      message: 'Error interno del servidor',
      error: {
        code: 'HTTP-500',
        details: ['Ocurrió un error inesperado'],
      },
      timestamp: new Date(),
    };
    response.status(500).json(errorResponse);
  }
}

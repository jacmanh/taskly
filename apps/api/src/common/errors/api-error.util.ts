import { HttpStatus } from '@nestjs/common';
import type { ApiError } from '@taskly/types';

export const createApiError = (
  statusCode: HttpStatus,
  code: string,
  message: string,
): ApiError => ({
  statusCode,
  code,
  message,
  error: HttpStatus[statusCode],
});

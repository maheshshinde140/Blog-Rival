import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(
      {
        statusCode,
        message,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends ApiException {
  constructor(message: string = 'Not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestException extends ApiException {
  constructor(message: string = 'Bad request') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends ApiException {
  constructor(message: string = 'Conflict') {
    super(message, HttpStatus.CONFLICT);
  }
}

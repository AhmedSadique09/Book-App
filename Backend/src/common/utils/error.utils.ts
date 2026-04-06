import { HttpException } from '@nestjs/common';

export function errorHandler(statusCode: number, message: string, detail?: string): HttpException {
    return new HttpException({ message, detail }, statusCode);
}

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * XSS 过滤管道
 * 过滤请求体中的潜在 XSS 攻击代码
 */
@Injectable()
export class XssSanitizePipe implements PipeTransform {
  private readonly xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    return this.sanitizeObject(value);
  }

  private sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    let sanitized = str;
    
    // 移除危险标签
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
    sanitized = sanitized.replace(/<object[^>]*>.*?<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed[^>]*>/gi, '');
    
    // 转义危险属性
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/on(\w+)\s*=/gi, 'data-blocked-$1=');
    
    return sanitized;
  }
}

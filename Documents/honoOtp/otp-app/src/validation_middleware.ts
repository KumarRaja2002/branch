import { Context, Next } from 'hono';
import { safeParse } from 'valibot';
import { otpSchema } from './validations/validation_schema';

const getFieldName = (path: any): string => {
  if (!Array.isArray(path) || path.length === 0) {
    return 'unknown_field';
  }
  return path[0].key;
};

class LoginValidationMiddleware {
  async validateLogin(c: Context, next: Next) {
    try {
      const schema = otpSchema;

      if (!schema) {
        throw new Error('Validation schema is not defined.');
      }

      const body = await c.req.json();
      const result = await safeParse(schema, body);

      if (!result.success) {
        const errors: Record<string, string> = {};

        result.issues.forEach((issue: any) => {
          const field = getFieldName(issue.path);
          let errorMessage: string;

          switch (issue.type) {
            case 'non_empty':
              errorMessage = `Please enter your ${field}.`;
              break;
            case 'min_length':
              errorMessage = `Your ${field} must have at least ${issue.requirement} characters.`;
              break;
            case 'max_length':
              errorMessage = `Your ${field} must not have more than ${issue.requirement} characters.`;
              break;
            case 'string':
              errorMessage = `Your ${field} must be a string.`;
              break;
            case 'starts_with':
              errorMessage = `Your ${field} must be starts with ${issue.requirement}`;
              break;
            default:
              errorMessage = 'Invalid input.';
          }

          errors[field] = errorMessage;
        });

        return c.json({
          success: false,
          message: 'Validation error',
          errors: errors,
        }, 422);
      }

      await next();
    } catch (error) {
      console.error('Unexpected Error:', error);
      return c.json({ success: false, message: 'Server error' }, 500);
    }
  }
}

export const loginValidationMiddleware = new LoginValidationMiddleware();

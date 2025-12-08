// Input validation and sanitization utilities

export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  // Remove any HTML tags and trim
  return input.replace(/<[^>]*>/g, '').trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validateAge(age: number): boolean {
  return typeof age === 'number' && age >= 16 && age <= 120;
}

export function validateHourlyRate(rate: number): boolean {
  return typeof rate === 'number' && rate >= 10 && rate <= 200;
}

export function validateUserInput(data: {
  email?: string;
  name?: string;
  phone?: string;
  age?: number;
  bio?: string;
  location?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.name && (data.name.length < 2 || data.name.length > 100)) {
    errors.push('Name must be between 2 and 100 characters');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number');
  }

  if (data.age !== undefined && !validateAge(data.age)) {
    errors.push('Invalid age (must be 16-120)');
  }

  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }

  if (data.location && (data.location.length < 2 || data.location.length > 100)) {
    errors.push('Location must be between 2 and 100 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Prevent XSS in user-generated content
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

// Rate limiting helper (simple in-memory implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export interface ImageValidationOptions {
  /** Maximum file size in bytes */
  maxSize?: number;
  /** List of allowed MIME types */
  allowedTypes?: string[];
  /** List of allowed file extensions (without the dot) */
  allowedExtensions?: string[];
  /** Whether to validate the base64 content format */
  validateContent?: boolean;
}

export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Validates file based on specified options
 *
 * @param file - The file object to validate
 * @param base64 - Optional base64 string representation of the file
 * @param options - Validation options
 * @returns Validation result with isValid flag and optional error message
 */
export const validateFile = (
  file: File,
  base64?: string,
  options: ImageValidationOptions = {}
): ValidationResult => {
  const {
    maxSize = 10 * 1024 * 1024,
    allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ],
    allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "pdf"],
    validateContent = true,
  } = options;

  // 1. Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds the maximum allowed size of ${(
        maxSize /
        (1024 * 1024)
      ).toFixed(2)}MB`,
    };
  }

  // 2. Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type '${
        file.type
      }' is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // 3. Check file extension
  const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension '.${fileExtension}' is not allowed. Allowed extensions: ${allowedExtensions.join(
        ", "
      )}`,
    };
  }

  // 4. Check base64 content if provided and validation is enabled
  if (base64 && validateContent) {
    // Check if base64 string has correct image signature
    const validImagePattern = /^data:image\/(jpeg|png|gif|webp);base64,/;
    if (!validImagePattern.test(base64)) {
      return {
        isValid: false,
        error: "Invalid image format or content",
      };
    }
  }

  return { isValid: true };
};

/**
 * Sanitizes a filename to prevent directory traversal and other security issues
 *
 * @param fileName - The filename to sanitize
 * @returns Sanitized filename
 */
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[/\\?%*:|"<>]/g, "-") // Replace unsafe characters
    .replace(/\.\./g, "-"); // Prevent directory traversal
};

/**
 * Converts a File object to base64 string
 *
 * @param file - The file to convert
 * @returns Promise resolving to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a data URL to file object
 *
 * @param dataUrl - The URL to convert
 * @param file - The name of the converted file
 * @returns Promise resolving to base64 string
 */
export const base64ToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(","),
    mime = /:(.*?);/.exec(arr[0])![1],
    bstr = atob(arr[arr.length - 1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

/**
 * Server-side validation for base64 image string
 * (Can be used in Node.js environments)
 *
 * @param base64 - The base64 string to validate
 * @param options - Validation options
 * @returns Validation result with isValid flag and optional error message
 */
export const validateBase64File = (
  base64: string,
  options: Omit<ImageValidationOptions, "validateContent"> = {}
): ValidationResult => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ],
  } = options;

  // 1. Check if it's a valid base64 image pattern
  const base64Pattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/;
  const matches = base64Pattern.exec(base64);

  if (!matches) {
    return {
      isValid: false,
      error: "Invalid base64 format",
    };
  }

  // 2. Extract MIME type and content
  const mimeType = matches[1];
  const base64Content = matches[2];

  // 3. Check MIME type
  if (!allowedTypes.includes(mimeType)) {
    return {
      isValid: false,
      error: `File type '${mimeType}' is not allowed. Allowed types: ${allowedTypes.join(
        ", "
      )}`,
    };
  }

  // 4. Check file size (approximate calculation from base64)
  const approximateSize = base64Content
    ? Math.ceil((base64Content.length * 3) / 4)
    : null;
  if (approximateSize && approximateSize > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds the maximum allowed size of ${(
        maxSize /
        (1024 * 1024)
      ).toFixed(2)}MB`,
    };
  }

  return { isValid: true };
};

export function randomString(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export class Logger {
  /**
   * Format console message with timestamp and level
   * @param {string} level
   * @param {string} message
   * @param {string} [context]
   * @returns {string}
   */
  static formatMessage(level, message, context) {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}] ` : '';
    return `[${timestamp}] [${level}] ${ctx}${message}`;
  }

  /**
   * Log info message
   * @param {string} message
   * @param {string} [context]
   */
  static info(message, context) {
    console.log(this.formatMessage('INFO', message, context));
  }

  /**
   * Log step message
   * @param {number|string} stepNumber
   * @param {string} description
   */
  static step(stepNumber, description) {
    console.log(`\n👉 Step ${stepNumber}: ${description}`);
  }

  /**
   * Log warning message
   * @param {string} message
   * @param {string} [context]
   */
  static warn(message, context) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  /**
   * Log error message
   * @param {string} message
   * @param {string} [context]
   * @param {any} [error]
   */
  static error(message, context, error) {
    console.error(this.formatMessage('ERROR', message, context), error || '');
  }
}

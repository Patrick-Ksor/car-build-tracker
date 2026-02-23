/**
 * Abstract base class for form validators.
 * Subclasses define the rules map; this class runs them all
 * and collects the error messages.
 */
export abstract class BaseValidator<T extends object> {
  protected abstract rules: Partial<
    Record<keyof T, (val: unknown) => string | null>
  >;

  /**
   * Validates all fields that have a rule defined.
   * Returns a map of fieldName → error string (or null if valid).
   */
  validate(data: Partial<T>): Record<keyof T, string | null> {
    const errors = {} as Record<keyof T, string | null>;

    for (const key of Object.keys(this.rules) as Array<keyof T>) {
      const rule = this.rules[key];
      if (rule) {
        errors[key] = rule(data[key]);
      }
    }

    return errors;
  }

  /**
   * Returns true only if every rule passes (no error strings).
   */
  isValid(data: Partial<T>): boolean {
    const errors = this.validate(data);
    return Object.values(errors).every((e) => e === null);
  }

  /**
   * Validates a single field by key.
   */
  validateField(key: keyof T, value: unknown): string | null {
    const rule = this.rules[key];
    return rule ? rule(value) : null;
  }
}

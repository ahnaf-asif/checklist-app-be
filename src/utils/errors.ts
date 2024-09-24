export class NoRecordFoundError extends Error {
  public readonly status: number;
  constructor(
    public readonly tableName: string,
    public readonly id: number
  ) {
    super('No record found');
    this.name = 'NoRecordFoundError';
    this.message = `No record found for table: '${tableName}' with id: '${id}'`;
    this.status = 404;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoRecordFoundError.constructor);
    }
  }
}

export class InvalidFieldError extends Error {
  public readonly status: number;
  constructor(
    public readonly tableName: string,
    public readonly field: string
  ) {
    super('Invalid field');
    this.name = 'InvalidFieldError';
    this.message = `Field: '${field}' is not allowed for table: '${tableName}'`;
    this.status = 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidFieldError.constructor);
    }
  }
}

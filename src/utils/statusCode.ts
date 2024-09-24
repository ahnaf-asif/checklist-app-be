export function getHttpStatusCodeFromDbError(err: any): number {
  switch (err.code) {
    case '23505': // Unique violation
      return 409; // Conflict
    case '23503': // Foreign key violation
      return 404; // Not Found
    case '22P02': // Invalid text representation
      return 400; // Bad Request
    case '28P01': // Invalid authorization specification
      return 401; // Unauthorized
    default:
      return 500; // Internal Server Error
  }
}

export function getHttpStatusCode(err: any): number {
  return err.code ? getHttpStatusCodeFromDbError(err) : (err.status ?? err.statusCode ?? 500);
}

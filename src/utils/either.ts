class Either<T> {
  constructor(
    public val: T | undefined,
    public err: Error | undefined
  ) {}

  static try<T>(fn: () => T): Either<T> {
    try {
      return new Either<T>(fn(), undefined);
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return new Either<T>(undefined, error);
    }
  }

  static tryAsync<T>(fn: () => Promise<T>): Promise<Either<T>> {
    return new Promise((resolve) => {
      fn()
        .then((val) => resolve(new Either<T>(val, undefined)))
        .catch((e) => {
          const error = e instanceof Error ? e : new Error(String(e));
          resolve(new Either<T>(undefined, error));
        });
    });
  }

  isError(): boolean {
    return this.err !== null;
  }
}

export default Either;

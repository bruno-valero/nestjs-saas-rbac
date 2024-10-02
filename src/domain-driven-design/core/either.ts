/**
 * Error
 */
export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }

  //   getRight() {
  //     return this.value as unknown as Right<L, R>['value']
  //   }

  //   getLeft() {
  //     return this.value as Left<L, R>['value']
  //   }
}

/**
 * Success
 */
export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }

  //   getRight() {
  //     return this.value as Right<L, R>['value']
  //   }

  //   getLeft() {
  //     return this.value as unknown as Left<L, R>['value']
  //   }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <L, R>(value: L): Either<L, R> => new Left(value)

export const right = <L, R>(value: R): Either<L, R> => new Right(value)

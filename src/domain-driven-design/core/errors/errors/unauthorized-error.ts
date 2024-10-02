import { UseCaseError } from '@core/errors/use-case-errors'

export class UnauthorizedError extends Error implements UseCaseError {
  constructor() {
    super('unauthorized.')
  }
}

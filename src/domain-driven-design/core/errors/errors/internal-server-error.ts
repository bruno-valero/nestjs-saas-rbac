import { UseCaseError } from '@core/errors/use-case-errors'

export class InternalServerError extends Error implements UseCaseError {
  constructor() {
    super('internal server error.')
  }
}

import { UseCaseError } from '@core/errors/use-case-errors'

export class DataValidationError extends Error implements UseCaseError {
  constructor(message: string) {
    super(`data is not valid ${message}`)
  }
}

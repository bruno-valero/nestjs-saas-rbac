import { UseCaseError } from '@core/errors/use-case-errors'

export class EntityTypeError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
  }
}

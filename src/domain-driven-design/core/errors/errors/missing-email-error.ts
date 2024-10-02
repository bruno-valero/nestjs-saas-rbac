import { UseCaseError } from '@core/errors/use-case-errors'

export class MissingEmailError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'missing email.')
  }
}

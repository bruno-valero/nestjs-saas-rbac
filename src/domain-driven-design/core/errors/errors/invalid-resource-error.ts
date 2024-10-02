import { UseCaseError } from '@core/errors/use-case-errors'

export class InvalidResourceError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'invalid resource.')
  }
}

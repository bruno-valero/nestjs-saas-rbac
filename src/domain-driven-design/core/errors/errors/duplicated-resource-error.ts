import { UseCaseError } from '@core/errors/use-case-errors'

export class DuplicatedResourceError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'resource already exists.')
  }
}

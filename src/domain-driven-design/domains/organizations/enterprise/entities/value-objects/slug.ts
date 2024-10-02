export class Slug {
  props: {
    value: string
  } = {
    value: '',
  }

  constructor(private readonly value?: string) {
    if (value) {
      this.create(value)
    }
  }

  create(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replaceAll(/ +/g, '-')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/[^-^\w]+/g, '')
      .replaceAll(/_/g, '-')
      .replaceAll(/--+/g, '')
      .replaceAll(/-$/g, '')
      .replaceAll(/^-/g, '')

    this.props.value = slug
    return this
  }

  toString() {
    return this.props.value
  }
}

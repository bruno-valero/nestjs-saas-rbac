import { Public } from '@auth/public'
import { Controller, Get } from '@nestjs/common'

@Controller()
export class HelloWorldController {
  constructor() {}

  @Get()
  @Public()
  async printHelloWorld() {
    return 'Hello World!'
  }
}

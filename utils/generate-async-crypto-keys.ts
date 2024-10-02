import fs from 'node:fs'
import path from 'node:path'

import { exec } from 'child_process'

class AsyncCryptoKeys {
  private _publicKey: string | null = null
  private _privateKey: string | null = null

  private _publicKeyBase64: string | null = null
  private _privateKeyBase64: string | null = null

  get publicKey() {
    return this._publicKey
  }

  get privateKey() {
    return this._privateKey
  }

  get publicKeyBase64() {
    return this._publicKeyBase64
  }

  get privateKeyBase64() {
    return this._privateKeyBase64
  }

  // Função para executar os comandos
  async generate() {
    const baseDir = path.resolve(__dirname, '..')
    const keysDir = path.resolve(baseDir, 'keys')

    const privateKeyPath = path.resolve(keysDir, 'private_key.pem')
    const publicKeyPath = path.resolve(keysDir, 'public_key.pem')

    if (!this.fileExists(keysDir)) {
      fs.mkdir(keysDir, { recursive: true }, (err) =>
        console.log('erro ao criar o arquivo', err?.message),
      )
    }

    // const password = randomUUID()

    // const privateKeyCommand = `openssl genpkey -algorithm RSA -out ${privateKeyPath} -aes256 -pass pass:${password}`
    const privateKeyCommand = `openssl genpkey -algorithm RSA -out ${privateKeyPath} -pkeyopt rsa_keygen_bits:2048`
    // const publicKeyCommand = `openssl rsa -pubout -in ${privateKeyPath} -out ${publicKeyPath} -passin pass:${password}`
    const publicKeyCommand = `openssl rsa -pubout -in ${privateKeyPath} -out ${publicKeyPath}`

    this.execute(
      privateKeyCommand,
      'private',
      async () =>
        await this.waitFor(() => this.fileExists(privateKeyPath, true)),
      () => this.execute(publicKeyCommand, 'public'),
    )

    const privatePathExists = await this.waitFor(() =>
      this.fileExists(privateKeyPath, true),
    )
    const publicPathExists = await this.waitFor(() =>
      this.fileExists(publicKeyPath, true),
    )

    const isCreated = privatePathExists && publicPathExists

    console.log('isCreated - openssl', isCreated)
    if (isCreated) {
      const { privateKeyContent, publicKeyContent } = await this.getKeys({
        privateKeyPath,
        publicKeyPath,
      })

      this._privateKey = privateKeyContent
      this._publicKey = publicKeyContent

      console.log('generating base64')
      const privateKeyBse64Path = path.resolve(
        keysDir,
        'private_key_base64.pem',
      )
      const publicKeyBse64Path = path.resolve(keysDir, 'public_key_base64.pem')

      const privateKeyContentBase64 = Buffer.from(
        privateKeyContent ?? '',
        'utf8',
      )?.toString('base64')
      const publicKeyContentBase64 = Buffer.from(
        publicKeyContent ?? '',
        'utf8',
      )?.toString('base64')

      fs.writeFileSync(privateKeyBse64Path, privateKeyContentBase64)
      fs.writeFileSync(publicKeyBse64Path, publicKeyContentBase64)

      this._privateKeyBase64 = privateKeyContentBase64
      this._publicKeyBase64 = publicKeyContentBase64

      // const privateKeyBase64Command = `openssl base64 -in ${privateKeyPath} -out ${privateKeyBse64Path} -pass pass:${password}`
      // const publicKeyBase64Command = `openssl base64 -in ${publicKeyPath} -out ${publicKeyBse64Path} -pass pass:${password}`

      // this.execute(privateKeyBase64Command, 'private')
      // this.execute(publicKeyBase64Command, 'public')

      // const privatePathExists = await this.waitFor(() =>
      //   this.fileExists(privateKeyBse64Path, true),
      // )
      // const publicPathExists = await this.waitFor(() =>
      //   this.fileExists(publicKeyBse64Path, true),
      // )

      // const isCreated = privatePathExists && publicPathExists

      // if (isCreated) {
      //   const keys = await this.getKeys({
      //     privateKeyPath: privateKeyBse64Path,
      //     publicKeyPath: publicKeyBse64Path,
      //   })

      //   this._privateKeyBase64 = keys.privateKeyContent
      //   this._publicKey = keys.publicKeyContent
      // }
    }
  }

  fileExists(path: string, throwError?: boolean) {
    const info = fs.existsSync(path)

    if (!info && throwError) throw new Error('file does not exist')
    return info
  }

  /**
   * This function loops through a function rerunning all assertions
   * inside of it until it gets a truthy result.
   *
   * If the maximum duration is reached, it then rejects.
   *
   * @param expectations A function containing all tests assertions
   * @param maxDuration Maximum wait time before rejecting
   */
  async waitFor(assertions: () => void, maxDuration = 1000): Promise<boolean> {
    return new Promise((resolve) => {
      let elapsedTime = 0

      const interval = setInterval(() => {
        elapsedTime += 10

        try {
          assertions()
          clearInterval(interval)
          resolve(true)
          // eslint-disable-next-line
        } catch (err) {
          if (elapsedTime >= maxDuration) {
            resolve(false)
          }
        }
      }, 10)
    })
  }

  private execute(
    command: string,
    key: 'public' | 'private',
    fileCreation?: () => Promise<boolean>,
    callback?: () => { execOperation: boolean; callbackOperation: boolean },
  ) {
    let execOperation: boolean = false
    let callbackOperation: boolean = false

    console.log('\nexecuting', command)
    exec(command, async (error) => {
      if (error) {
        console.error(
          `Erro ao extrair chave ${key === 'public' ? 'pública' : 'privada'}: ${error.message}`,
        )
        return
      }

      console.log(
        '- ',
        `Chave ${key === 'public' ? 'pública' : 'privada'} gerada com sucesso.`,
      )
      execOperation = true

      const isCreated = fileCreation ? await fileCreation() : false

      if (callback && isCreated) {
        const { execOperation } = callback()
        callbackOperation = execOperation
      }
    })

    return { execOperation, callbackOperation }
  }

  private readKeyFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return content
    } catch (error: any) { //eslint-disable-line
      console.error(`Erro ao ler o arquivo ${filePath}: ${error.message}`)
      return null
    }
  }

  private async getKeys({
    privateKeyPath,
    publicKeyPath,
  }: {
    privateKeyPath: string
    publicKeyPath: string
  }) {
    const privatePathExists = await this.waitFor(() =>
      this.fileExists(privateKeyPath, true),
    )
    const publicPathExists = await this.waitFor(() =>
      this.fileExists(publicKeyPath, true),
    )

    if (!privatePathExists || !publicPathExists)
      throw new Error('files dont exist')

    // Leitura da chave privada
    const privateKeyContent = this.readKeyFile(privateKeyPath)

    // if (privateKeyContent) {
    //   console.log('Conteúdo da chave privada:')
    //   console.log(privateKeyContent)
    // }

    // Leitura da chave pública
    const publicKeyContent = this.readKeyFile(publicKeyPath)

    // if (publicKeyContent) {
    //   console.log('Conteúdo da chave pública:')
    //   console.log(publicKeyContent)
    // }

    return { privateKeyContent, publicKeyContent }
  }
}

const keys = new AsyncCryptoKeys()

keys.generate()

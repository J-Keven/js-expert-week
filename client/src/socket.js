class Socket {
  #serverConnection = {}

  constructor({ host, port, protocol }) {
    this.host = host
    this.port = port
    this.protocol = protocol

  }

  async createConnection() {
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: "upgrade",
        Upgrade: "websocket"
      }
    }

    const http = await import(this.protocol);

    const req = http.request(options)

    req.end()

    return new Promise(resolve => {
      req.once("upgrade", (req, socket) => resolve(socket))
    })
  }

  async initialize() {

    this.#serverConnection = await this.createConnection()
    console.log("I connected in the Server!!")
  }

}

export default Socket;
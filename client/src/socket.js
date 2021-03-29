import Events from "events"

class Socket {
  #serverConnection = {}
  #serverListener = new Events()

  constructor({ host, port, protocol }) {
    this.host = host
    this.port = port
    this.protocol = protocol

  }

  async sendMessage(event, message) {
    this.#serverConnection.write(JSON.stringify({ event, message }))
  }

  attachEvents(events) {
    this.#serverConnection.on("data", data => {
      try {
        data
          .toString()
          .split('\n')
          .filter(line => !!line)
          .map(JSON.parse)
          .map(({ event, message }) => {
            this.#serverListener.emit(event, message)
          })
      } catch (error) {
        console.log("invalid!!", data.toString(), error)
      }
    })


    this.#serverConnection.on("end", () => console.log("I Desconnected"))
    this.#serverConnection.on("error", () => console.log("DEU MERDA!!!!"))

    for (const [key, value] of events) {
      this.#serverListener.on(key, value)
    }
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
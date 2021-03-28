class Controller {
  #users = new Map()

  constructor({ socketServer }) {
    this.socketServer = socketServer;
  }

  onNewConnection(socket) {
    const { id } = socket;

    console.log("connection stablished with", id);

    const userData = { id, socket };

    this.#updateGlobalUsersData({
      socketId: id,
      userData
    })

    socket.on("data", this.#onSocketData(id))
    socket.on("error", this.#onSocketError(id))
    socket.on("end", this.#onSocketEnd(id))
  }

  #onSocketData(id) {
    return data => {
      console.log({ '#onSocketData': data.toString() })
    }
  }

  #onSocketError(id) {
    return data => {
      console.log({ '#onSocketError': data.toString() })
    }
  }

  #onSocketEnd(id) {
    return data => {
      console.log({ '#onSocketEnd': `users disconnected: ${id}` })
    }
  }

  #updateGlobalUsersData({ socketId, userData }) {
    const user = this.#users.get(socketId) || {}

    const userDataUpdate = {
      ...user,
      ...userData,
    }

    this.#users.set(socketId, userDataUpdate)

    return this.#users.get(socketId)
  }
}

export default Controller
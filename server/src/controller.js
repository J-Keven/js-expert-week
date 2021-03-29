import { constants } from "./constants.js";

class Controller {
  #users = new Map()
  #rooms = new Map()

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

  async joinRoom(socketId, data) {
    const userData = data
    console.log(`${userData.username} joined! - [${socketId}]`);
    const { roomId } = userData;
    const user = this.#updateGlobalUsersData({
      socketId,
      userData
    })

    const users = this.#joinUserOnRoom(roomId, user);


    //manda atualizar o usuario que conectou sobre quais usuários já
    //estao conectados na msm sala
    const currentUsers = Array.from(users.values()).map(({ id, username }) => ({ username, id }))
    this.socketServer.sendMessage(user.socket, constants.events.UPDATE_USERS, currentUsers)

    this.bradCast({
      socketId,
      roomId,
      message: { id: socketId, username: userData.username },
      event: constants.events.NEW_USER_CONNECTED,
    })
  }

  #joinUserOnRoom(roomId, user) {
    const usersOnRoom = this.#rooms.get(roomId) ?? new Map()

    usersOnRoom.set(user.id, user)

    this.#rooms.set(roomId, usersOnRoom)

    return usersOnRoom
  }

  bradCast({ socketId, roomId, event, message, includeCurrentSocket = false }) {
    const usersOnRoom = this.#rooms.get(roomId)

    for (const [key, user] of usersOnRoom) {
      if (includeCurrentSocket && key === socketId) continue;

      this.socketServer.sendMessage(user.socket, event, message);
    }
  }

  #onSocketData(id) {
    return data => {
      try {
        const { event, message } = JSON.parse(data)
        this[event](id, message)
        console.log(event)
      } catch (error) {
        console.error("wrong event format!!!", data.toString())
      }
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
    const user = this.#users.get(socketId) ?? {}

    const userDataUpdate = {
      ...user,
      ...userData,
    }

    this.#users.set(socketId, userDataUpdate)

    return this.#users.get(socketId)
  }
}

export default Controller
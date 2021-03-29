import { constants } from "./constants.js"

class EventManager {

  #allUsers = new Map()

  constructor({ componetEmitter, socketClient }) {
    this.componetEmitter = componetEmitter;
    this.socketClient = socketClient;
  }

  joinRoomEndWaitForMassega(data) {
    this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data)

    this.componetEmitter.on(constants.events.app.MESSAGE_RECEIVED, msg => {
      this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg)
    })
  }

  updateUsers(users) {
    const conectedUser = users;
    conectedUser.forEach(({ id, username }) => this.#allUsers.set(id, username));

    this.#updateUsersComponent()

  }

  newUserConnected(message) {
    const user = message;
    this.#allUsers.set(user.id, user.username);

    this.#updateUsersComponent()
    this.#updateActivityLogComponent(`${user.username} joined!`)

  }

  #emitterComponentUpdate(event, message) {
    this.componetEmitter.emit(
      event,
      message,
    )
  }

  #updateUsersComponent() {
    this.#emitterComponentUpdate(
      constants.events.app.STATUS_UPDATED,
      Array.from(this.#allUsers.values())
    )
  }

  #updateActivityLogComponent(message) {
    this.#emitterComponentUpdate(
      constants.events.app.ACTIVITY_UPDATED,
      message
    )
  }

  getEvents() {
    const functions = Reflect.ownKeys(EventManager.prototype)
      .filter(fn => fn !== "constructor")
      .map(name => [name, this[name].bind(this)])

    return new Map(functions)
  }
}

export default EventManager
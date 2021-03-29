import componentBuild from "./Component.js"
import { constants } from "./constants.js"

class TerminalController {
  #users = new Map()

  constructor() { }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue()
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, message)
      console.log(message)
      this.clearValue()
    }
  }

  #pickerCollor() {
    return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
  }

  #getUserCollor(username) {
    if (this.#users.has(username)) {
      return this.#users.get(username)
    }

    const collor = this.#pickerCollor()
    this.#users.set(username, collor)

    return collor
  }

  #onMessageReceived(eventEmitter, { screen, chat }) {
    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, msg => {
      const { username, message } = msg

      const collor = this.#getUserCollor(username);

      chat.addItem(`{${collor}}{bold}${username}{/}: ${message}`);
      screen.render()
    })

  }

  #onActivityLogChange(eventEmitter, { screen, activity }) {
    eventEmitter.on(constants.events.app.ACTIVITY_UPDATED, msg => {
      const [username] = msg.toString().split(/\s/)

      const collor = this.#getUserCollor(username);

      activity.addItem(`{${collor}}{bold}${msg.toString()}`);
      screen.render()
    })

  }

  #onStatuschange(eventEmitter, { screen, status }) {
    eventEmitter.on(constants.events.app.STATUS_UPDATED, users => {

      const { content } = status.items.shift()
      status.clearItems()
      status.addItem(content)

      users.forEach(username => {
        const collor = this.#getUserCollor(username);
        status.addItem(`{${collor}}{bold}${username}{/}`);
      });

      screen.render()
    })

  }

  async initialize(eventEmitter) {
    const components = new componentBuild()
      .setScreen({ title: "ChatMessage - J-keven" })
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setStatusComponent()
      .setActivityLogComponent()
      .build()

    this.#onMessageReceived(eventEmitter, components)
    this.#onActivityLogChange(eventEmitter, components)
    this.#onStatuschange(eventEmitter, components)

    components.input.focus()
    components.screen.render()

    // setInterval(() => {
    //   const users = ["J-keven"]
    //   eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //   users.push("ironMan")
    //   eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //   users.push("spiderMan", "superMan")
    //   eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //   users.push("iara")
    //   eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    // }, 2000)
  }
}

export default TerminalController;
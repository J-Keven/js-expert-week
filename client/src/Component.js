import blessed from "blessed"

class Component {

  #screen
  #layout
  #input
  #chat
  #status
  #activity

  constructor() { }

  #baseComponent() {
    return {
      border: "line",
      mouse: true,
      keys: true,
      top: 0,
      scrollbar: {
        ch: '',
        inverse: true,
      },
      tags: true
    }
  }

  setScreen({ title }) {
    this.#screen = blessed.screen({
      smartCSR: true,
      title
    })

    this.#screen.key(["q", "C-c"], () => process.exit(0))
    return this
  }

  setLayoutComponent() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: "100%",
      height: "100%",
    })

    return this
  }

  setInputComponent(onEnterPressed) {
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      inputOnFocus: true,
      height: "10%",
      padding: {
        top: 1,
        left: 2,
      },
      style: {
        fg: "#f6f6f6",
        bg: "#353535"
      }
    })

    input.key("enter", onEnterPressed);
    this.#input = input

    return this
  }

  setChatComponent() {

    this.#chat = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      align: "left",
      width: "50%",
      height: "90%",
      items: ["{bold}Messager{/}"]
    })

    return this
  }

  setStatusComponent() {
    this.#activity = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: "25%",
      height: "90%",
      items: ["{bold}Activity logs{/}"]
    })
    return this
  }

  setActivityLogComponent() {
    this.#status = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: "25%",
      height: "90%",
      style: {
        fg: "yellow"
      },
      items: ["{bold}Users on Room{/}"]
    })
    return this
  }

  build() {
    const component = {
      screen: this.#screen,
      input: this.#input,
      chat: this.#chat,
      activity: this.#activity,
      status: this.#status
    }

    return component
  }
}


export default Component
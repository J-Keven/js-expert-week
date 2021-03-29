import Events from "events"
import CliConfigs from './src/CliConfigs.js'
import Socket from "./src/socket.js";
import TerminalController from "./src/TerminalController.js";
import EventManager from "./src/eventManager.js";


const [nodePath, filePath, ...commands] = process.argv

const commandsParsed = CliConfigs.parseArguments(commands)

console.log(commandsParsed)

const componentEmiter = new Events()
const socketClient = new Socket(commandsParsed)
await socketClient.initialize()
const eventManager = new EventManager({
  componetEmitter: componentEmiter,
  socketClient,
})

const events = eventManager.getEvents()
socketClient.attachEvents(events)

const data = {
  roomId: commandsParsed.room,
  username: commandsParsed.username
}

eventManager.joinRoomEndWaitForMassega(data)

const terminalController = new TerminalController()

await terminalController.initialize(componentEmiter)
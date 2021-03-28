import Events from "events"
import CliConfigs from './src/CliConfigs.js'
import Socket from "./src/socket.js";
import TerminalController from "./src/TerminalController.js";


const [nodePath, filePath, ...commands] = process.argv

const commandsParsed = CliConfigs.parseArguments(commands)

console.log(commandsParsed)

const componentEmiter = new Events()
const terminalController = new TerminalController()
const socketClient = new Socket(commandsParsed)
await socketClient.initialize()

// await terminalController.initialize(componentEmiter)
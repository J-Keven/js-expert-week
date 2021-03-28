import Event from "events"
import { constants } from "./constants.js";
import Controller from "./controller.js";
import SocketServer from "./socket.js"

const port = process.env.PORT || 9898

const events = new Event()
const socketServer = new SocketServer({ port });
const server = await socketServer.initialize(events)

const controller = new Controller({ socketServer })
console.log("socket on in port", server.address().port)

events.on(constants.events.NEW_USER_CONNECTED, controller.onNewConnection.bind(controller))


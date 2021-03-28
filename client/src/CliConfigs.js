class CliConfigs {
  constructor({ username, room, host }) {
    this.username = username
    this.room = room

    const { protocol, port, hostname } = new URL(host)

    this.host = hostname
    this.port = port
    this.protocol = protocol.replace(/\W/, '')

  }

  static parseArguments(commands) {
    const cmd = new Map();

    for (const key in commands) {

      const index = parseInt(key);
      const command = commands[index];

      const commandPreffix = '--'
      if (!commands[key].includes(commandPreffix)) continue;

      cmd.set(commands[index].replace(commandPreffix, ''), commands[index + 1])

    }
    return new CliConfigs(Object.fromEntries(cmd))
  }
}

export default CliConfigs
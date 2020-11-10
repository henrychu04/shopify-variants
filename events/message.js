module.exports = (client, message) => {
  if (message.author.bot) return;

  if (message.content.indexOf(client.config.prefix) !== 0) return;

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);

  if (!cmd) return;

  console.log('User:', message.author.id);

  if (command == 'login') {
    console.log(`Command: !login ${args[0]}`);
  } else {
    console.log(`Command: ${message.content}`);
  }

  cmd.run(client, message, args);
};

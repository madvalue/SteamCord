const Discord = require("discord.js");
const Config = require("./Config.js");
const Commands = require("./Commands.js");

const Client = new Discord.Client();


Client.on("ready", () => {
    console.log(`Logged as ${Client.user.tag}`);
});

Client.on("message", async (message) => {
    await Commands.searchForCommands(message);
});


Client.login(process.env.DISCORD_TOKEN || Config.DISCORD_TOKEN);
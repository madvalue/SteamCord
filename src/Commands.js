const Config = require("./Config.js");

var Commands = [];
module.exports = {
    registerCommand: (alias, callback) => {
        Commands[alias] = callback;
    },

    searchForCommands: async (message) => {
        var prefix = Config.PREFIX;
        if (!message.content.startsWith(prefix)) return false;

        var args = message.content.split(" ");
        var alias = args[0].replace(prefix, "");
        args.shift();

        if (Commands[alias]) return await Commands[alias](message, args);
        else return false;
    }
}
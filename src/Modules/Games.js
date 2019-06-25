const Commands = require("../Commands.js");
const Store = require("./../Steam/Store.js");

Commands.registerCommand("game", async (ctx, args) => {
    ctx.channel.startTyping();

    try {
        var game_name = args.join(" ");
        var gameid = await Store.getIdByName(game_name);
        var data = await Store.getDetails(gameid);

        console.log(data);
    } catch (Err) {
        ctx.reply("", {
            embed: {
                description: Err.message,
                color: 13632027
            }
        });
    }

    ctx.channel.stopTyping();
});
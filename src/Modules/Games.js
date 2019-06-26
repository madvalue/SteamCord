const Commands = require("../Commands.js");
const Store = require("./../Steam/Store.js");

Commands.registerCommand("game", async (ctx, args) => {
    ctx.channel.startTyping();

    try {
        var game_name = args.join(" ");
        var gameid = await Store.getIdByName(game_name);
        var data = await Store.getDetails(gameid);

        ctx.reply("", {
            embed: {
                color: 4886754,
                description: data.short_description,
                author: {
                    name: data.name,
                    url: `https://store.steampowered.com/app/${data.steam_appid}`
                },
                image: {
                    url: data.header_image
                },
                fields: [
                    {
                        name: "Name",
                        value: data.name,
                        inline: true
                    },
                    {
                        name: "Price",
                        value: data.price_overview.discount_percent > 0 ? `~~${data.price_overview.initial_formatted}~~ **${data.price_overview.final_formatted}**` : data.price_overview.final_formatted,
                        inline: true
                    },
                    {
                        name: "Publishers",
                        value: data.publishers.join("\n"),
                        inline: true
                    },
                    {
                        name: "Developers",
                        value: data.developers.join("\n"),
                        inline: true
                    },
                    {
                        name: "Release date",
                        value: data.release_date.date,
                        inline: true
                    },
                    {
                        name: "Steam ID",
                        value: data.steam_appid,
                        inline: true
                    },
                    {
                        name: "Categories",
                        value: data.categories.map(x => { return x.description; }).join(", "),
                        inline: false
                    }
                ]
            } 
        });
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
const Commands = require("./../Commands.js");
const Config = require("./../Config.js");
const Profiles = require("./../Steam/Profiles.js");
const Groups = require("./../Steam/Groups.js");

const EMOJI_NO = "❌";
const EMOJI_YES = "✔️";

Commands.registerCommand("profile", async (ctx, args) => {
    try {
        if (typeof args[0] === "undefined") return ctx.reply("", {
            embed: {
                color: 4886754,
                description: `Something went wrong! You should use: ${Config.PREFIX}profile [Username from URL]`
            }
        });

        ctx.channel.startTyping();

        var isnum = /^\d+$/.test(args[0]);
        var steamid = isnum ? args[0] : await Profiles.usernameToID(args[0]);
        var summaries = await Profiles.getSummaries(steamid);
        var bans = await Profiles.getBans(steamid);
        var primary_group = await Groups.getByID(summaries.primaryclanid);

        console.log(summaries);
        console.log(bans);
        console.log(primary_group);

        ctx.reply("", {
            embed: {
                color: 4886754,
                author: {
                    name: summaries.personaname,
                    url: summaries.profileurl,
                    icon_url: `https://www.countryflags.io/${summaries.loccountrycode}/shiny/64.png`
                },
                thumbnail: {
                    url: summaries.avatarfull
                },
                fields: [
                    {
                        name: "Informations",
                        value: `
                            **Username:** ${summaries.personaname}`
                            + `${primary_group.memberList.groupDetails[0].groupName[0].length > 0 ? "\n**Primary group:**" : ""} ${primary_group.memberList.groupDetails[0].groupName[0]}
                            ` + `**Privacy:** ${summaries.communityvisibilitystate == 3 ? 'Public' : 'Private'}
                            **SteamID:** ${summaries.steamid}
                        `,
                        inline: true
                    },
                    {
                        name: "Bans",
                        value: `
                            ${bans.VACBanned ? EMOJI_YES : EMOJI_NO} Valve Anti-Cheat
                            ${bans.CommunityBanned ? EMOJI_YES : EMOJI_NO} Community
                        `,
                        inline: true
                    }
                ]
            }
        })
    } catch (Err) {
        ctx.reply("", {
            embed: {
                color: 13632027,
                description: Err.message
            }
        })
    }

    ctx.channel.stopTyping();
});
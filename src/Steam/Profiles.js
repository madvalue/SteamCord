const c = require("cache");
const axios = require("axios");
const Config = require("./../Config.js");

const Cache = new c(Config.CACHE);
const STEAM_KEY = process.env.STEAM_KEY || Config.STEAM_KEY;

var Profile = {
    usernameToID: async (username) => {
        try {
            var steamid = Cache.get(`steamid64.${username}`);
            if (steamid) return steamid;

            var request = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_KEY}&vanityurl=${username}`);
            var data = request.data.response;

            if (data.success == 1) {
                Cache.put(`steamid64.${username}`, data.steamid);
                return data.steamid;
            } else if (data.success == 42) throw new Error("Can't found user with that URL");
            else throw new Error("Something went wrong when searching for user"); 
        } catch (Err) {
            console.log(Err);
            throw new Error("Something went wrong when searching for user");
        }
    },

    getSummaries: async (steamid) => {
        try {
            var summary = Cache.get(`profile.${steamid}`);
            if (summary) return summary;

            var request = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamid}`);
            var data = request.data;

            if (data.response.players.length > 0) {
                Cache.put(`profile.${steamid}`, data.response.players[0]);
                return data.response.players[0];
            } else throw new Error("Can't find profile with specified steam id");
        } catch (Err) {
            throw Err;
        }
    },

    getBans: async (steamid) => {
        try {
            var bans = Cache.get(`bans.${steamid}`);
            if (bans) return bans;

            var request = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${STEAM_KEY}&steamids=${steamid}`);
            var data = request.data;

            if (data.players.length > 0) {
                Cache.put(`bans.${steamid}`, data.players[0]);
                return data.players[0];
            } else throw new Error("Can't find information about bans for specific steam id");
        } catch (Err) {
            throw Err;
        }
    }
};

module.exports = Profile;
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

    getSummaries: async (username) => {
        try {
            var summary = Cache.get(`profile.${username}`);
            if (summary) return summary;

            var steamid = await Profile.usernameToID(username);
            var request = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamid}`);
            var data = request.data;

            if (data.length > 0) {
                Cache.put(`profile.${username}`, data.response.players[0]);
                return data.response.players[0];
            } else throw new Error("Can't find profile with specified username");
        } catch (Err) {
            throw Err;
        }
    },
};

module.exports = Profile;
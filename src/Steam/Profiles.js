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
};

module.exports = Profile;
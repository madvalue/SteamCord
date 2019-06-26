const c = require("cache");
const axios = require("axios");
const Config = require("./../Config.js");

const Cache = new c(Config.CACHE_GAMES);
const STEAM_KEY = process.env.STEAM_KEY || Config.STEAM_KEY;

var Store = {
    getAllGames: async (last_appid=0, max_results=10000) => {
        try {
            var games = Cache.get(`games-last_appid.${last_appid}`);
            if (games) return games;

            var request = await axios.get(`https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${STEAM_KEY}&last_appid=${last_appid}&max_results=${max_results}`);
            var data = request.data.response;

            if (data.apps < 0) throw new Error("Something went wrong while checking games list");
            else {
                Cache.put("games", data);
                return data;
            }
        } catch (Err) {
            throw Err;
        }   
    },

    getIdByName: async (name) => {
        try {
            var gameid = Cache.get(`game.${name.toLowerCase()}`);
            if (gameid) return gameid;

            var stage = 1;
            var last_appid = 0;
            while (true) {
                var games = await Store.getAllGames(last_appid, 10000);
                var game_index = games.apps.map(function(x) {return x.name.toLowerCase(); }).indexOf(name.toLowerCase());

                if (game_index > -1 || !games.have_more_results) break;
                last_appid = games.last_appid;
                stage++;
            }

            if (game_index === -1) throw new Error("Can't find game with specified name");
            var game_id = games.apps[game_index].appid;

            Cache.put(`game.${name.toLowerCase()}`, game_id);
            return game_id;
        } catch (Err) {
            throw Err;
        }
    },

    getDetails: async (gameid) => {
        try {
            var game = Cache.get(`game_details.${gameid}`);
            if (game) return game;

            var request = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameid}`);
            var data = request.data[gameid];

            if (!data.success) throw new Error("Something went wrong while checking game details");
            else {
                Cache.put(`game_details.${gameid}`);
                return data.data;
            }
        } catch (Err) {
            throw Err;
        }
    }
};

module.exports = Store;
const c = require("cache");
const axios = require("axios");
const xml2js = require("xml2js");
const promisify = require("util.promisify");
const Config = require("./../Config.js");

const Cache = new c(Config.CACHE);
const Parser = new xml2js.Parser();
      Parser.parseString = promisify(Parser.parseString);
const STEAM_KEY = process.env.STEAM_KEY || Config.STEAM_KEY;

var Groups = {
    getByID: async (gid) => {
        try {
            var group = Cache.get(`group.${gid}`);
            if (group) return group;

            var request = await axios.get(`https://steamcommunity.com/gid/${gid}/memberslistxml/?xml=1`);
            var data = await Parser.parseString(request.data);

            Cache.put(`group.${gid}`, data);
            return data;
        } catch (Err) {
            console.log(Err);
            throw new Error("Can't retrieve informations about this group");
        }
    }
};

module.exports = Groups;
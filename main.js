require("dotenv").config();

require("./src/Discord.js");

(async () => {
    const Profiles = require("./src/Steam/Profiles.js");
    console.log(await Profiles.usernameToID("maciegtoja"));
    console.log(await Profiles.usernameToID("maciegtoja"));
})();

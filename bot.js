const Discord = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

client.on("message", message => {
    if (message.content === "Test") {
        return message.channel.send("Hello world!");
    };
});

client.login(process.env.token);
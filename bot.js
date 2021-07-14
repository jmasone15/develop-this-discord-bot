// Required Dependencies
const Discord = require("discord.js");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// New instance of the Discord client class 
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

// Discord Collection of all client commands.
client.commands = new Discord.Collection();

// First, grab all of the files in the ./commands folder.
// Then, loop through all of the files in the folder.
// Finally, set the command name and command file in the commands collection.
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const commandFile = require(`./commands/${file}`);
    client.commands.set(commandFile.name, commandFile);
}

// Command message listener.
client.on("message", message => {
    // If the message does not start with the bot's prefix, end the function.
    // If the message was sent by another bot, end the function.
    if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

    // Get the arguments and the command name from the message.
    // In the args constant, we seperate all of the arguments into an array.
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
    const cName = args.shift().toLowerCase();

    // Get the command from the command collection and verify it exists.
    // Also, check if the command is an alias for another command.
    // If there is no command with the input or alias name, the function ends.
    const command = client.commands.get(cName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cName));
    if (!command) return;

    // Prevents server commands from being executed in the DMs.
    if (command.guildOnly && message.channel.type === "dm") {
        return message.reply("I can't execute that command inside DMs!");
    };

    // Execute desired command
    try {
        command.execute(message, args)
    } catch (err) {
        console.error(err);
        message.reply("There was a server side error, please contact bot admin for assitance.");
    };
});

// Ready listener
// Sets the bot's activity and logs a string.
client.once("ready", () => {
    client.user.setPresence({ activity: { name: "$help", type: "LISTENING" }, status: "online" });
    console.log("Ready!");
});

// Start the bot.
client.login(process.env.token);
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

    // Check to see if the input command has any permission restrictions.
    // If there are command permissions, check to see if the message author has the required permissions.
    // If not, the function ends.
    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply("You don't have permissions for this command");
        };
    };

    // If a command requires arguments, this validation runs to make sure the user added arguments to the command.
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        // If a usage is set up, show the user the proper way to run the command.
        if (command.usage) {
            reply += `\n\nThe proper usage would be: \n\`${process.env.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

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
// Required Dependencies
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// New instance of the Discord client class 
const client = new Discord.Client();

// Discord Collections.
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

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
        };

        return message.channel.send(reply);
    };

    // Command cooldowns
    // This cooldowns collection won't hold any data long term, it will be used as a short term watcher for command spams.
    // Whenever a command is used, the name of the command and the user who called the command will be saved in the collection.
    // If the message author tries to resend the command within a certain time frame, a cooldown handler will fire within the function.
    // This cooldown handler informs the message author that they need to wait a certain amount of time before using that command again.
    // After a certain amount of time has passed, the collection value will be deleted so that the user is free to use the command again.
    const { cooldowns } = client;

    // If the command has not been previously set in the cooldowns collection, set it in there.
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    };

    // Current timestamp
    const now = Date.now();

    // Grab the targeted command from the cooldowns collection.
    const timestamps = cooldowns.get(command.name);

    // Grab the cooldown time value from the command and set it to seconds.
    const coolTime = (command.cooldown || 1) * 1000;

    // If there is already a log of the author using this command previously, check to see if they are within the time frame of cooldown.
    // If they are, send them the cooldown error message and tell them how long they have to wait.
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + coolTime;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    // If there is not already a log of the author using this command, set one with the timestamp of now.
    timestamps.set(message.author.id, now);

    // Set a timeout to delete the command log once the cooldown time has passed.
    setTimeout(() => timestamps.delete(message.author.id), coolTime);

    // Execute desired command
    try {
        command.execute(message, args, Discord, client);
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

// Connection to the database to store user profiles.
mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
});

// Test for heroku

// Start the bot.
client.login(process.env.token);
module.exports = {
    name: "help",
    description: "List of all commands or info about a specific command.",
    guildOnly: false,
    args: false,
    usage: " or $help <command name>",
    aliases: ["commands"],
    cooldown: 3,
    async execute(message, args, Discord) {
        // Get the list of all commands in this folder from the command collection.
        const { commands } = message.client;
        const commandObjectArray = [];

        // Map over all of the commands and add each one into the Object Array as an object.
        commands.map(c => commandObjectArray.push({ name: `\`${c.name}\``, value: c.description }));

        // If no particular command was specified, DM the author with a list of all commands.
        if (!args.length) {
            const allCommandsEmbed = new Discord.MessageEmbed()
                .setColor("#7700ff")
                .setTitle("Command List:")
                .setDescription(`You can use \`$[command name]\` to get more info on a specific command.`)
                .addFields(commandObjectArray)
                .setTimestamp();

            try {

                // Send the author a dm with the commands embed.
                await message.author.send(allCommandsEmbed);

                // If the author sent the command in a dm, end the function.
                // If the author sent the command in a guild, tell them the message is in their dms.
                if (message.channel.type === "dm") return;
                message.reply("I've sent you a DM with all my commands!");

            } catch (err) {
                console.error(err);
                message.reply("It seems like I can't DM you! Do you have DMs disabled?");
            };
        } else if (args.length) {
            // If there is a specific command in the arguments the user would like to learn more about,
            // Find that specific command in the collection of commands either by it's name or aliases.
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));

            // Validation to check if the command actually exists.
            if (!command) {
                return message.reply("That command does not exist in my directory. \nTo see a full list of my commands, use the \`$help\` command.");
            };

            // Build out command embed message.
            const commandEmbed = new Discord.MessageEmbed()
                .setColor("#7700ff")
                .setTitle(command.name)
                .setDescription(command.description)
                .addField("Aliases", command.aliases.join(" "))
                .addField("Usage", `$${command.name} ${command.usage}`)
                .addField("Cooldown", `${command.cooldown || 3} second(s)`)

            try {
                await message.channel.send(commandEmbed);
                message.reply("To see a full list of my commands, use the \`$help\` command.")
            } catch (err) {
                console.error(err);
                message.reply("Something went wrong trying to see this command.");
            };
        };
    },
};
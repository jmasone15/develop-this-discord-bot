const { Client, Intents, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const wait = require("util").promisify(setTimeout);
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
client.cooldowns = new Collection();

const botCommands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.command.name, command);
    botCommands.push(command.data.command.toJSON());
}

client.once("ready", async () => {

    const rest = new REST({ version: "9" }).setToken(token);
    try {
        console.log("Started refreshing application (/) commands.");

        const res = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: botCommands },
        );

        res.forEach(command => {
            console.log(`Successfully loaded command: ${command.name}`);
        });

        console.log("Finished loading application (/) commands");
    } catch (err) {
        console.error(err);
    }

    client.user.setPresence({ activity: { name: "Hello, world!", type: "LISTENING" }, status: "online" });
    console.log("Ready!");
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    const commandName = command.data.command.name;

    if (!command) return;

    // Cooldowns
    const { cooldowns } = client;
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const coolTime = (command.data.cooldown || 1) * 1000;

    if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + coolTime;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            await interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`, ephemeral: true });
            await wait(expirationTime - now);
            return await interaction.editReply({ content: `You can now use the \`${commandName}\` command again!`});
        }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), coolTime);

    try {
        console.log(`Executed ${commandName} command.`)
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: "There was an error whil executing this command!", ephemeral: true });
    }
})

client.login(token);